import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

import { buildDerivedPatch, computeDerived, withRoleFingerprint } from "./derived";
import { attachCreatedAt, queueHistoryEvents } from "./history";
import { applyDotPatch } from "./lib/patch";
import { stripUndefinedDeep } from "./lib/sanitize";
import { nowTs } from "./lib/time";
import { applicationsColRef, applicationDocRef, historyColRef, historyDocRef } from "./refs";
import {
  ApplicationDoc,
  FeedbackType,
  HistoryEventDoc,
  ProcessStatus,
  RejectionReasonCode,
  Sentiment,
  WorkMode,
  EmploymentType,
  DotPatch,
} from "./types";
import { ensureUserDoc, getUserDoc } from "./user";

/**
 * Create new application with initial history event (SYSTEM).
 * Also computes derived blocks (matching/priority/followup/reapply/fingerprint) on the client.
 */
export async function createApplication(
  db: Firestore,
  userId: string,
  input: {
    companyName: string;
    roleTitle: string;
    vacancyUrl?: string;
    source?: string;
    status?: ProcessStatus; // default SAVED
    locationText?: string;
    workMode?: WorkMode;
    employmentType?: EmploymentType;
    tags?: string[];
    currentNote?: string;
    rawDescription?: string;
  },
): Promise<string> {
  // Ensure user doc exists (Firestore-only mode)
  await ensureUserDoc(db, userId);

  // Use Firestore-generated IDs
  const appId = doc(applicationsColRef(db, userId)).id;
  const appRef = applicationDocRef(db, userId, appId);

  const t = nowTs();
  const status: ProcessStatus = input.status ?? "SAVED";

  const appDoc: ApplicationDoc = {
    createdAt: t,
    updatedAt: t,
    createdBy: userId,
    archived: false,
    job: {
      companyName: input.companyName,
      roleTitle: input.roleTitle,
      vacancyUrl: input.vacancyUrl,
      source: input.source,
      locationText: input.locationText,
      workMode: input.workMode,
      employmentType: input.employmentType,
    },
    process: {
      status,
      lastStatusChangeAt: t,
      contactAttempts: 0,
      followUpLevel: 0,
      needsFollowUp: false,
      needsReapplySuggestion: false,
    },
    notes: {
      currentNote: input.currentNote,
      tags: input.tags ?? [],
    },
    vacancy: input.rawDescription
      ? { rawDescription: input.rawDescription, roleFingerprint: undefined }
      : undefined,
  };

  // Derived fields
  const user = await getUserDoc(db, userId);
  const derived = computeDerived(user, appDoc, t);
  const derivedApp: ApplicationDoc = {
    ...withRoleFingerprint(appDoc, derived.roleFingerprint),
    matching: derived.matching,
    process: {
      ...appDoc.process,
      ...derived.followUp,
      ...derived.reapply,
    },
    priority: derived.priority,
  };

  const batch = writeBatch(db);
  batch.set(appRef, stripUndefinedDeep(derivedApp));

  // Initial history event (SYSTEM)
  const hId = doc(historyColRef(db, userId, appId)).id;
  const hRef = historyDocRef(db, userId, appId, hId);
  const h: HistoryEventDoc = {
    createdAt: t,
    actor: "system",
    type: "SYSTEM",
    comment: "Application created",
  };
  batch.set(hRef, stripUndefinedDeep(h));

  await batch.commit();
  return appId;
}

/**
 * Fetch one application by id
 */
export async function getApplication(
  db: Firestore,
  userId: string,
  appId: string,
): Promise<ApplicationDoc | null> {
  const ref = applicationDocRef(db, userId, appId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as ApplicationDoc) : null;
}

/**
 * Load latest history (descending)
 */
export async function getApplicationHistory(
  db: Firestore,
  userId: string,
  appId: string,
  take: number = 50,
): Promise<Array<{ id: string; data: HistoryEventDoc }>> {
  const q = query(
    historyColRef(db, userId, appId),
    orderBy("createdAt", "desc"),
    limit(take),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    data: d.data() as HistoryEventDoc,
  }));
}

/**
 * Update application with history event(s) in ONE batch.
 * Also recomputes derived fields (matching/priority/followup/reapply/fingerprint) client-side.
 *
 * NOTE: patch may include dot-path keys (e.g. "process.status").
 */
export async function updateApplicationWithHistory(
  db: Firestore,
  userId: string,
  appId: string,
  patch: Partial<ApplicationDoc> | Record<string, any>,
  buildHistory: (current: ApplicationDoc) => HistoryEventDoc[],
): Promise<void> {
  const appRef = applicationDocRef(db, userId, appId);
  const snap = await getDoc(appRef);
  if (!snap.exists()) throw new Error(`Application ${appId} not found`);

  const current = snap.data() as ApplicationDoc;
  const t = nowTs();

  const patchRaw: DotPatch = { ...(patch as any), updatedAt: t };
  const next = applyDotPatch(current as any, patchRaw);

  // Derived
  const user = await getUserDoc(db, userId);
  const derived = computeDerived(user, next, t);
  const patchFinal = stripUndefinedDeep({
    ...patchRaw,
    ...buildDerivedPatch(derived),
  });

  const events = attachCreatedAt(buildHistory(current), t);

  const batch = writeBatch(db);
  batch.update(appRef, patchFinal);
  queueHistoryEvents(batch, db, userId, appId, events);
  await batch.commit();
}

/**
 * Convenience: change status (writes STATUS_CHANGE + updates lastStatusChangeAt)
 */
export async function changeStatus(
  db: Firestore,
  userId: string,
  appId: string,
  toStatus: ProcessStatus,
): Promise<void> {
  await updateApplicationWithHistory(
    db,
    userId,
    appId,
    {
      "process.status": toStatus,
      "process.lastStatusChangeAt": nowTs(),
    } as any,
    (current) => [
      {
        actor: "user",
        type: "STATUS_CHANGE",
        fromStatus: current.process.status,
        toStatus,
      },
    ],
  );
}

/**
 * Convenience: add comment history event (no application change needed except updatedAt)
 */
export async function addComment(
  db: Firestore,
  userId: string,
  appId: string,
  comment: {
    text: string;
    feedbackType?: FeedbackType;
    sentiment?: Sentiment;
    rejectionReasonCode?: RejectionReasonCode;
  },
): Promise<void> {
  await updateApplicationWithHistory(db, userId, appId, {}, () => [
    {
      actor: "user",
      type: "COMMENT",
      comment: comment.text,
      feedbackType: comment.feedbackType,
      sentiment: comment.sentiment,
      rejectionReasonCode: comment.rejectionReasonCode,
    },
  ]);
}

/**
 * Queries (Pipeline / Today / Follow-ups)
 */
export async function queryPipelineByStatus(
  db: Firestore,
  userId: string,
  status: ProcessStatus,
  take: number = 50,
): Promise<Array<{ id: string; data: ApplicationDoc }>> {
  const q = query(
    applicationsColRef(db, userId),
    where("archived", "==", false),
    where("process.status", "==", status),
    orderBy("process.lastStatusChangeAt", "desc"),
    limit(take),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, data: d.data() as ApplicationDoc }));
}

export async function queryTodayTopPriority(
  db: Firestore,
  userId: string,
  take: number = 20,
): Promise<Array<{ id: string; data: ApplicationDoc }>> {
  const q = query(
    applicationsColRef(db, userId),
    where("archived", "==", false),
    orderBy("priority.score", "desc"),
    limit(take),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, data: d.data() as ApplicationDoc }));
}

export async function queryFollowUpsDue(
  db: Firestore,
  userId: string,
  take: number = 50,
): Promise<Array<{ id: string; data: ApplicationDoc }>> {
  const q = query(
    applicationsColRef(db, userId),
    where("archived", "==", false),
    where("process.needsFollowUp", "==", true),
    orderBy("process.followUpDueAt", "asc"),
    limit(take),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, data: d.data() as ApplicationDoc }));
}

// Re-exported for backwards compatibility with older imports.
export { ensureUserDoc } from "./user";

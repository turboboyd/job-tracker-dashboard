import type { Firestore } from "firebase/firestore";

import {
  type ApplicationDoc,
  type ProcessStatus,
  createApplication,
  ensureUserDoc,
  queryFollowUpsDue,
  queryPipelineByStatus,
  queryTodayTopPriority,
} from "src/features/applications/firestoreApplications";

export type ApplicationsRepo = ReturnType<typeof createApplicationsRepo>;

/**
 * DI-friendly repository for ApplicationsPage.
 * The page (composition layer) injects Firestore; the model/hooks stay db-agnostic.
 */
export function createApplicationsRepo(db: Firestore) {
  return {
    ensureUserDoc: (userId: string) => ensureUserDoc(db, userId),

    createApplication: (
      userId: string,
      payload: Parameters<typeof createApplication>[2]
    ) => createApplication(db, userId, payload),

    queryPipelineByStatus: (
      userId: string,
      status: ProcessStatus,
      limit: number
    ) => queryPipelineByStatus(db, userId, status, limit),

    queryTodayTopPriority: (userId: string, limit: number) =>
      queryTodayTopPriority(db, userId, limit),

    queryFollowUpsDue: (userId: string, limit: number) =>
      queryFollowUpsDue(db, userId, limit),
  };
}

export type { ApplicationDoc, ProcessStatus };

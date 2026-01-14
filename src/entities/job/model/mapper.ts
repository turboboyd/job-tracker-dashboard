import type { Timestamp } from "firebase/firestore";

import type { Job, JobDoc } from "./types";

function tsToIso(ts: Timestamp | null | undefined): string | null {
  if (!ts) return null;
  return ts.toDate().toISOString();
}

export function jobDocToJob(id: string, doc: JobDoc): Job {
  return {
    id,
    userId: doc.userId,
    title: doc.title,
    company: doc.company,
    location: doc.location,
    type: doc.type,
    status: doc.status,
    source: doc.source,
    url: doc.url,
    notes: doc.notes,
    createdAt: doc.createdAt.toDate().toISOString(),
    updatedAt: doc.updatedAt.toDate().toISOString(),
    appliedAt: tsToIso(doc.appliedAt ?? null),
  };
}

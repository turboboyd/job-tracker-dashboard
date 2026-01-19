import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "src/shared/config/firebase/firebase";

import type { Job } from "../model/types";

type UseJobsResult = {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
};

function toJob(id: string, data: Record<string, unknown>): Job {
  const nowIso = new Date().toISOString();

  return {
    id,
    userId: String(data.userId ?? ""),
    title: String(data.title ?? "Untitled"),
    company: String(data.company ?? "Unknown"),
    status: String(data.status ?? "saved") as Job["status"],
    createdAt: String(data.createdAt ?? nowIso),
    updatedAt: String(data.updatedAt ?? nowIso),
    appliedAt:
      data.appliedAt === null
        ? null
        : data.appliedAt
        ? String(data.appliedAt)
        : undefined,
  };
}

export function useJobs(userId?: string | null): UseJobsResult {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    queueMicrotask(() => setIsLoading(true));

    const q = query(
      collection(db, "jobs"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setJobs(snap.docs.map((d) => toJob(d.id, d.data())));
        setIsLoading(false);
        setError(null);
      },
      (e) => {
        setError(e.message ?? "Failed to load jobs");
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [userId]);

  const result = useMemo<UseJobsResult>(() => {
    if (!userId) return { jobs: [], isLoading: false, error: null };
    return { jobs, isLoading, error };
  }, [userId, jobs, isLoading, error]);

  return result;
}

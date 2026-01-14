import type { JobStatus } from "./types";

export const JOB_STATUSES: JobStatus[] = ["saved", "applied", "interview", "rejected"];

export function isJobStatus(v: unknown): v is JobStatus {
  return typeof v === "string" && (JOB_STATUSES as readonly string[]).includes(v);
}

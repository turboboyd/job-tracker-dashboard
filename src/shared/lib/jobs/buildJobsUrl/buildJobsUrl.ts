import type { JobStatus } from "src/entities/job/model/types";
import type { JobsSort } from "src/pages/JobsPage/model/useJobQueryParams";

type Args = {
  status?: JobStatus | null;
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: JobsSort;
};

export function buildJobsUrl(args: Args) {
  const sp = new URLSearchParams();

  if (args.status) sp.set("status", args.status);
  if (args.q && args.q.trim()) sp.set("q", args.q.trim());
  if (args.sort) sp.set("sort", args.sort);
  if (args.page && args.page > 1) sp.set("page", String(args.page));
  if (args.pageSize) sp.set("pageSize", String(args.pageSize));

  const qs = sp.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

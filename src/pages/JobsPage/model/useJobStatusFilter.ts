import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { isJobStatus } from "src/entities/job/model/constants";
import type { Job, JobStatus } from "src/entities/job/model/types";

type FilterValue = JobStatus | "all";

export function useJobStatusFilter(jobs: Job[]) {
  const [params, setParams] = useSearchParams();

  const statusParam = params.get("status");
  const filterStatus = isJobStatus(statusParam) ? statusParam : null;

  const filteredJobs = useMemo(() => {
    if (!filterStatus) return jobs;
    return jobs.filter((j) => j.status === filterStatus);
  }, [jobs, filterStatus]);

  function setFilter(status: FilterValue) {
    const next = new URLSearchParams(params);
    if (status === "all") next.delete("status");
    else next.set("status", status);
    setParams(next);
  }

  function isActive(status: FilterValue) {
    return (status === "all" && !filterStatus) || status === filterStatus;
  }

  return { filterStatus, filteredJobs, setFilter, isActive };
}
    
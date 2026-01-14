import React from "react";

import { useUpdateJobStatusMutation } from "src/entities/job/api/jobApi";
import { JOB_STATUSES } from "src/entities/job/model/constants";
import type { JobStatus } from "src/entities/job/model/types";
import { Button } from "src/shared/ui";

type Props = {
  jobId: string;
  value: JobStatus;
};

export function JobStatusPills({ jobId, value }: Props) {
  const [updateStatus, state] = useUpdateJobStatusMutation();

  return (
    <div className="flex flex-wrap items-center gap-1">
      {JOB_STATUSES.map((s) => {
        const active = s === value;

        return (
          <Button
            key={s}
            type="button"
            size="sm"
            shape="pill"
            variant={active ? "default" : "outline"}
            disabled={state.isLoading}
            onClick={() => {
              if (s === value) return;
              updateStatus({ jobId, status: s });
            }}
          >
            {s.toUpperCase()}
          </Button>
        );
      })}
    </div>
  );
}

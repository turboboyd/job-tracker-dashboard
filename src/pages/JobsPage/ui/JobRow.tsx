import React from "react";

import { JobStatusDropdown } from "src/entities/job";
import type { Job, JobStatus } from "src/entities/job/model/types";
import { formatDate } from "src/shared/lib/date/formatDate";
import { Button } from "src/shared/ui";

export function JobRow({
  job,
  onEdit,
  onStatusChange,
  isUpdating,
}: {
  job: Job;
  onEdit: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  isUpdating: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-foreground">
          {job.title}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {job.company}
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          Created: {formatDate(job.createdAt)}
          {job.updatedAt !== job.createdAt ? (
            <> · Updated: {formatDate(job.updatedAt)}</>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <JobStatusDropdown
          mode="edit"
          value={job.status}
          disabled={isUpdating}
          onChange={(next) => onStatusChange(job.id, next)}
          size="sm"
        />

        <Button
          variant="outline"
          size="sm"
          shape="pill"
          onClick={() => onEdit(job)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}

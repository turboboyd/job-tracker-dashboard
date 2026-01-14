import React from "react";

import { useUpdateJobMutation } from "src/entities/job/api/jobApi";
import type { Job } from "src/entities/job/model/types";
import { JobForm } from "src/entities/job/ui/JobForm/JobForm";
import { normalizeError } from "src/shared/lib";
import { Modal } from "src/shared/ui";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
};

export function EditJobModal({ open, onOpenChange, job }: Props) {
  const [updateJob, updateState] = useUpdateJobMutation();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit job"
      description="Update fields and save changes."
    >
      {!job ? (
        <div className="text-sm text-muted-foreground">No job selected.</div>
      ) : (
        <JobForm
          job={job}
          submitLabel="Save changes"
          isSubmittingExternal={updateState.isLoading}
          errorExternal={updateState.isError ? normalizeError(updateState.error) : null}
          onCancel={() => onOpenChange(false)}
          onSubmit={async (patch) => {
            await updateJob({ jobId: job.id, patch }).unwrap();
            onOpenChange(false);
          }}
        />
      )}
    </Modal>
  );
}

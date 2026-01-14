import React from "react";

import { useCreateJobMutation } from "src/entities/job/api/jobApi";
import { JobForm } from "src/entities/job/ui/JobForm/JobForm";
import { useAuth } from "src/shared/lib";
import { Modal } from "src/shared/ui";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JobModal({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const userId = user?.uid ?? null;

  const [createJob, createState] = useCreateJobMutation();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add job"
      description="Create a new job entry."
    >
      {!userId ? (
        <div className="text-sm text-muted-foreground">Sign in to add jobs.</div>
      ) : (
        <JobForm
          job={null}
          submitLabel="Create job"
          isSubmittingExternal={createState.isLoading}
          errorExternal={
            createState.isError
              ? String((createState.error as any)?.message ?? createState.error)
              : null
          }
          onCancel={() => onOpenChange(false)}
          onSubmit={async (patch) => {
            await createJob({
              userId,
              ...patch,
            }).unwrap();

            onOpenChange(false);
          }}
        />
      )}
    </Modal>
  );
}

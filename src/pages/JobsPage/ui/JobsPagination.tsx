import React from "react";

import { Button } from "src/shared/ui";

type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function JobsPagination({ page, totalPages, onPrev, onNext }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-5 flex items-center justify-between gap-3">
      <Button
        variant="outline"
        size="sm"
        shape="pill"
        disabled={page <= 1}
        onClick={onPrev}
      >
        Prev
      </Button>

      <div className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </div>

      <Button
        variant="outline"
        size="sm"
        shape="pill"
        disabled={page >= totalPages}
        onClick={onNext}
      >
        Next
      </Button>
    </div>
  );
}

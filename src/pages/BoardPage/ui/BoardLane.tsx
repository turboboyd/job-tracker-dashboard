import React from "react";

import type { LoopMatchStatus } from "src/entities/loop/model/types";
import { classNames } from "src/shared/lib";

import { getDragPayload } from "../model/dnd";
import type { BoardDragPayload } from "../model/types";

export function BoardLane({
  status,
  children,
  onDropMatch,
  onDropToEnd,
}: {
  status: LoopMatchStatus;
  children: React.ReactNode;
  onDropMatch: (payload: BoardDragPayload, target: LoopMatchStatus) => void;
  onDropToEnd: () => void;
}) {
  const [over, setOver] = React.useState(false);

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
        if (e.target === e.currentTarget) {
          onDropToEnd();
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);

        const payload = getDragPayload(e.dataTransfer);
        if (!payload) return;

        onDropMatch(payload, status);
      }}
      className={classNames(
        "flex-1 min-h-0",
        "rounded-xl border border-border bg-muted/40",
        "p-md",
        "overflow-y-auto overflow-x-hidden",
        over && "bg-muted"
      )}
    >
      {children}
    </div>
  );
}

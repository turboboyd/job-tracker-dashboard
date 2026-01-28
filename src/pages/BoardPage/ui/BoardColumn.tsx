import React from "react";

import type { LoopMatchStatus } from "src/entities/loop/model/types";
import type { TypeMatch } from "src/entities/match/model/types";
import { Card } from "src/shared/ui";

import type { BoardDragPayload } from "../model/types";

import { BoardLane } from "./BoardLane";
import { BoardMatchCard } from "./BoardMatchCard";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function DropSlot({
  index,
  setDropIndex,
}: {
  index: number;
  setDropIndex: (n: number) => void;
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDropIndex(index);
      }}
      className="h-2"
    />
  );
}

export function BoardColumn({
  status,
  title,
  matches,
  loopIdToName,
  busy,
  onDropMatch,
  onDelete,
}: {
  status: LoopMatchStatus;
  title: string;
  matches: TypeMatch[];
  loopIdToName: Map<string, string>;
  busy: boolean;
  onDropMatch: (
    payload: BoardDragPayload,
    target: LoopMatchStatus,
    toIndex: number
  ) => void;
  onDelete: (matchId: string) => void;
}) {
  const [dropIndex, setDropIndex] = React.useState<number>(matches.length);

  React.useEffect(() => {
    setDropIndex(matches.length);
  }, [matches.length]);

  return (
    <div className="w-[320px] shrink-0 h-full min-h-0 flex flex-col">
      <Card variant="subtle" padding="md" shadow="none" className="shrink-0 mb-md">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground">{matches.length}</div>
        </div>
      </Card>

      <BoardLane
        status={status}
        onDropMatch={(payload, target) => {
          const safe = clamp(dropIndex, 0, matches.length);
          onDropMatch(payload, target, safe);
        }}
        onDropToEnd={() => setDropIndex(matches.length)}
      >
        <div className="flex flex-col">
          <DropSlot index={0} setDropIndex={setDropIndex} />

          {matches.map((m, i) => (
            <React.Fragment key={m.id}>
              <div className="mb-md">
                <BoardMatchCard
                  match={m}
                  loopName={loopIdToName.get(m.loopId) ?? ""}
                  busy={busy}
                  onDelete={onDelete}
                  index={i}
                />
              </div>

              <DropSlot index={i + 1} setDropIndex={setDropIndex} />
            </React.Fragment>
          ))}
        </div>

        {matches.length === 0 ? (
          <div className="pt-md text-xs text-muted-foreground">Drop matches here.</div>
        ) : null}
      </BoardLane>
    </div>
  );
}

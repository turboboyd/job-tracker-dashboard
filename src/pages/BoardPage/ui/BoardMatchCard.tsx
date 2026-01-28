import React from "react";

import { labelStatus } from "src/entities/loop/lib";
import type { TypeMatch } from "src/entities/match/model/types";
import { MatchDetailsModal } from "src/entities/match/ui/matchCard/MatchDetailsModal";
import {
  formatMatchedAt,
  normalizePlatform,
} from "src/entities/match/ui/matchCard/matchFormat";
import { classNames } from "src/shared/lib";
import { Card } from "src/shared/ui";

import { setDragPayload } from "../model/dnd";
import type { BoardDragPayload } from "../model/types";

export function BoardMatchCard({
  match,
  loopName,
  busy,
  onDelete,
  index,
}: {
  match: TypeMatch;
  loopName: string;
  busy: boolean;
  onDelete: (matchId: string) => void;
  index: number;
}) {
  const [open, setOpen] = React.useState(false);

  const matchedAt = React.useMemo(
    () => formatMatchedAt(match.matchedAt),
    [match.matchedAt]
  );

  const platform = React.useMemo(() => {
    const p = normalizePlatform(match.platform);
    return p ? p.toUpperCase() : "";
  }, [match.platform]);

  const meta = React.useMemo(() => {
    const parts = [match.location, platform, matchedAt, loopName]
      .map((v) => String(v ?? "").trim())
      .filter(Boolean);
    return parts.join(" • ");
  }, [match.location, platform, matchedAt, loopName]);

  return (
    <>
      <div
        draggable={!busy}
        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
          const payload: BoardDragPayload = {
            matchId: match.id,
            fromStatus: match.status,
            fromIndex: index,
          };
          setDragPayload(e.dataTransfer, payload);
          e.dataTransfer.effectAllowed = "move";
        }}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(true);
        }}
        className={classNames(
          "rounded-xl outline-none",
          busy
            ? "opacity-60 cursor-not-allowed"
            : "cursor-grab active:cursor-grabbing",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <Card
          variant="default"
          padding="md"
          shadow="sm"
          interactive
          className={classNames(
            "flex flex-col gap-sm",
            "transition-[box-shadow,transform] duration-fast ease-ease-out",
            !busy && "hover:shadow-md hover:-translate-y-[1px]"
          )}
        >
          <div className="min-w-0">
            <div className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis text-sm">
              <span className="font-semibold text-foreground">
                {match.title || "—"}
              </span>
              <span className="ml-2 text-muted-foreground">
                {match.company || "—"}
              </span>
            </div>

            {meta ? (
              <div className="mt-1 text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                {meta}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {labelStatus(match.status)}
            </span>
          </div>
        </Card>
      </div>

      <MatchDetailsModal
        open={open}
        onOpenChange={setOpen}
        match={match}
        loopName={loopName}
        busy={busy}
        onDelete={onDelete}
      />
    </>
  );
}

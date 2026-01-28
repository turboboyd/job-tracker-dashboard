import { LOOP_MATCH_STATUSES } from "src/entities/loop/model/constants";
import type { LoopMatchStatus } from "src/entities/loop/model/types";
import { normalizeError } from "src/shared/lib";
import { PageHeader, PageMessage } from "src/shared/ui";

import type { BoardVM } from "../model/types";
import type { BoardDragPayload } from "../model/types";


import { BoardColumn } from "./BoardColumn";

export function BoardView({ vm }: { vm: BoardVM }) {
  const { matchesQ } = vm.queries;

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden">
      <PageHeader
        title="Board"
        subtitle="Drag matches between columns to update status."
      />

      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
        {matchesQ.isLoading ? (
          <PageMessage>Loading matches…</PageMessage>
        ) : matchesQ.isError ? (
          <PageMessage>{normalizeError(matchesQ.error)}</PageMessage>
        ) : vm.data.matches.length === 0 ? (
          <PageMessage>No matches yet.</PageMessage>
        ) : (
          <div className="h-full min-h-0 flex items-stretch gap-md min-w-max">
            {LOOP_MATCH_STATUSES.map((s) => (
              <BoardColumn
                key={s.value}
                status={s.value}
                title={s.label}
                matches={vm.data.byStatus.get(s.value) ?? []}
                loopIdToName={vm.data.loopIdToName}
                busy={vm.busy}
                onDelete={vm.actions.onDelete}
                onDropMatch={async (
                  payload: BoardDragPayload,
                  target: LoopMatchStatus,
                  toIndex: number
                ) => {
                  await vm.actions.onDropToStatus(payload, target, toIndex);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

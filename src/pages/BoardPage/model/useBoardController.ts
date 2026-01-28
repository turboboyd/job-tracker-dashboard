import React from "react";

import { LOOP_MATCH_STATUSES } from "src/entities/loop/model/constants";
import type { LoopMatchStatus } from "src/entities/loop/model/types";
import type { TypeMatch } from "src/entities/match/model/types";
import { useMatchesDerived } from "src/pages/MatchesPage/model/useMatchesDerived";
import { useMatchesMutations } from "src/pages/MatchesPage/model/useMatchesMutations";
import { useMatchesQueries } from "src/pages/MatchesPage/model/useMatchesQueries";
import { useAuth } from "src/shared/lib";

import {
  loadOrder,
  saveOrder,
  ensureIdsExist,
  sortByOrder,
  createEmptyOrder,
} from "./order";
import type { BoardVM, BoardDragPayload, BoardOrderByStatus } from "./types";

function groupByStatus(matches: TypeMatch[]) {
  const map = new Map<LoopMatchStatus, TypeMatch[]>();
  for (const s of LOOP_MATCH_STATUSES) map.set(s.value, []);
  for (const m of matches) (map.get(m.status) ?? []).push(m);
  return map;
}

export function useBoardController(): BoardVM {
  const { user } = useAuth();
  const userId = user?.uid ?? null;

  const { matchesQ, matches, loops } = useMatchesQueries(userId);
  const { busy, actions } = useMatchesMutations(userId);
  const { loopIdToName } = useMatchesDerived(matches, loops);

  const [orderByStatus, setOrderByStatus] = React.useState<BoardOrderByStatus>(
    () => {
      if (!userId) return createEmptyOrder();
      return loadOrder(userId);
    }
  );

  React.useEffect(() => {
    if (!userId) return;
    setOrderByStatus(loadOrder(userId));
  }, [userId]);

  React.useEffect(() => {
    if (!userId) return;

    setOrderByStatus((prev) => {
      const next = { ...prev };
      ensureIdsExist(next, matches as TypeMatch[]);
      saveOrder(userId, next);
      return next;
    });
  }, [userId, matches]);

  const byStatus = React.useMemo(() => {
    const grouped = groupByStatus(matches as TypeMatch[]);

    for (const s of LOOP_MATCH_STATUSES) {
      const list = grouped.get(s.value) ?? [];
      const ordered = sortByOrder(list, orderByStatus[s.value] ?? []);
      grouped.set(s.value, ordered);
    }

    return grouped;
  }, [matches, orderByStatus]);

  const onDropToStatus = React.useCallback(
    async (
      payload: BoardDragPayload,
      toStatus: LoopMatchStatus,
      toIndex: number
    ) => {
      if (!userId) return;
      if (busy) return;

      setOrderByStatus((prev) => {
        const next: BoardOrderByStatus = { ...prev };

        const fromArr = [...(next[payload.fromStatus] ?? [])];
        const toArr =
          payload.fromStatus === toStatus
            ? fromArr
            : [...(next[toStatus] ?? [])];

        const currentFromIndex = fromArr.indexOf(payload.matchId);
        if (currentFromIndex !== -1) fromArr.splice(currentFromIndex, 1);

        const safeIndex = Math.max(0, Math.min(toIndex, toArr.length));
        toArr.splice(safeIndex, 0, payload.matchId);

        next[payload.fromStatus] =
          payload.fromStatus === toStatus ? toArr : fromArr;
        next[toStatus] = toArr;

        saveOrder(userId, next);
        return next;
      });

      if (payload.fromStatus !== toStatus) {
        await actions.onUpdateStatus(payload.matchId, toStatus);
      }
    },
    [actions, busy, userId]
  );

  return {
    busy,
    queries: { matchesQ },
    data: {
      matches,
      byStatus,
      loopIdToName,
    },
    actions: {
      onDelete: actions.onDelete,
      onDropToStatus,
    },
  };
}

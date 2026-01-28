import type { LoopMatchStatus } from "src/entities/loop/model/types";
import type { TypeMatch } from "src/entities/match/model/types";

export const BOARD_DND_MIME = "application/x-match";

export type BoardDragPayload = {
  matchId: string;
  fromStatus: LoopMatchStatus;
  fromIndex: number;
};

export type BoardOrderByStatus = Record<LoopMatchStatus, string[]>;

export interface BoardVM {
  busy: boolean;

  queries: {
    matchesQ: {
      isLoading: boolean;
      isError: boolean;
      error?: unknown;
    };
  };

  data: {
    matches: TypeMatch[];
    byStatus: Map<LoopMatchStatus, TypeMatch[]>;
    loopIdToName: Map<string, string>;
  };

  actions: {
    onDelete: (matchId: string) => void;
    onDropToStatus: (
      payload: {
        matchId: string;
        fromStatus: LoopMatchStatus;
        fromIndex: number;
      },
      toStatus: LoopMatchStatus,
      toIndex: number
    ) => Promise<void>;
  };
}

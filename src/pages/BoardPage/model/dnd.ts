import type { BoardDragPayload } from "./types";
import { BOARD_DND_MIME } from "./types";

export function safeJsonParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setDragPayload(dt: DataTransfer, payload: BoardDragPayload) {
  const raw = JSON.stringify(payload);
  dt.setData(BOARD_DND_MIME, raw);
  dt.setData("text/plain", raw);
  dt.effectAllowed = "move";
}

export function getDragPayload(dt: DataTransfer): BoardDragPayload | null {
  const raw = dt.getData(BOARD_DND_MIME) || dt.getData("text/plain");
  const payload = safeJsonParse<BoardDragPayload>(raw);

  if (!payload?.matchId || !payload?.fromStatus) return null;
  return payload;
}

import { LOOP_MATCH_STATUSES } from "src/entities/loop/model/constants";
import type { LoopMatchStatus } from "src/entities/loop/model/types";
import type { TypeMatch } from "src/entities/match/model/types";

import type { BoardOrderByStatus } from "./types";

function storageKey(userId: string) {
  return `board_order_v1:${userId}`;
}

export function createEmptyOrder(): BoardOrderByStatus {
  const obj = {} as BoardOrderByStatus;
  for (const s of LOOP_MATCH_STATUSES) obj[s.value] = [];
  return obj;
}

export function loadOrder(userId: string): BoardOrderByStatus {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return createEmptyOrder();
    const parsed = JSON.parse(raw) as BoardOrderByStatus;

    const base = createEmptyOrder();
    for (const s of Object.keys(base) as LoopMatchStatus[]) {
      const arr = Array.isArray(parsed?.[s]) ? parsed[s] : [];
      base[s] = arr.filter((x) => typeof x === "string");
    }
    return base;
  } catch {
    return createEmptyOrder();
  }
}

export function saveOrder(userId: string, order: BoardOrderByStatus) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(order));
  } catch {
    // ignore
  }
}

export function ensureIdsExist(
  order: BoardOrderByStatus,
  matches: TypeMatch[]
) {
  const existingIds = new Set(matches.map((m) => m.id));

  for (const status of Object.keys(order) as LoopMatchStatus[]) {
    order[status] = order[status].filter((id) => existingIds.has(id));
  }

  for (const m of matches) {
    const arr = order[m.status];
    if (!arr.includes(m.id)) arr.push(m.id);
  }
}

export function sortByOrder(matches: TypeMatch[], orderIds: string[]) {
  const pos = new Map<string, number>();
  orderIds.forEach((id, i) => pos.set(id, i));

  return [...matches].sort((a, b) => {
    const pa = pos.has(a.id) ? (pos.get(a.id) as number) : 1_000_000;
    const pb = pos.has(b.id) ? (pos.get(b.id) as number) : 1_000_000;
    return pa - pb;
  });
}

export function moveInArray<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

import { Timestamp } from "firebase/firestore";

import { DAY_MS } from "./constants";

export function nowTs(): Timestamp {
  return Timestamp.now();
}

export function addDays(ts: Timestamp, days: number): Timestamp {
  return Timestamp.fromMillis(ts.toMillis() + days * DAY_MS);
}

export function daysBetween(a: Timestamp, b: Timestamp): number {
  return Math.floor(Math.abs(a.toMillis() - b.toMillis()) / DAY_MS);
}

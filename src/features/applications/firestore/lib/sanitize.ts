import { Timestamp } from "firebase/firestore";

/**
 * Firestore rejects `undefined` values.
 * We keep payloads clean by stripping undefined recursively.
 *
 * Important: preserve Firestore Timestamp instances as-is.
 */
export function stripUndefinedDeep<T>(value: T): T {
  if (value === undefined || value === null) return value;
  if (value instanceof Timestamp) return value;

  if (Array.isArray(value)) {
    return value
      .filter((v) => v !== undefined)
      .map((v) => stripUndefinedDeep(v)) as unknown as T;
  }

  if (typeof value === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(value as any)) {
      if (v === undefined) continue;
      out[k] = stripUndefinedDeep(v);
    }
    return out;
  }

  return value;
}

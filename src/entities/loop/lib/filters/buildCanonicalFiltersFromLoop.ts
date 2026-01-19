import { CanonicalFilters } from "../../model";

export type CanonicalFilterPrimitive = string | number | boolean;
type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function toPrimitive(v: unknown): CanonicalFilterPrimitive | undefined {
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean")
    return v;
  return undefined;
}

function toPrimitiveArray(v: unknown): CanonicalFilterPrimitive[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: CanonicalFilterPrimitive[] = [];
  for (const item of v) {
    const p = toPrimitive(item);
    if (p !== undefined) out.push(p);
  }
  return out.length ? out : undefined;
}

export function buildCanonicalFiltersFromLoop(loop: unknown): CanonicalFilters {
  const result = {} as CanonicalFilters;

  if (!isRecord(loop)) return result;

  const maybeFilters = (loop as UnknownRecord).filters;
  const src = isRecord(maybeFilters) ? maybeFilters : loop;

  for (const [key, value] of Object.entries(src)) {
    const prim = toPrimitive(value);
    if (prim !== undefined) {
      (result as UnknownRecord)[key] = prim;
      continue;
    }

    const arr = toPrimitiveArray(value);
    if (arr !== undefined) {
      (result as UnknownRecord)[key] = arr;
      continue;
    }
  }

  return result;
}

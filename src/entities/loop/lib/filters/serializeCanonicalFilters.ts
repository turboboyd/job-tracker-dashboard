import { DEFAULT_CANONICAL_FILTERS } from "src/entities/loop/model/canonicalFilters";
import type { CanonicalFilters } from "src/entities/loop/model/types";

type CanonicalFilterPrimitive = string | number | boolean;
type CanonicalValue = CanonicalFilterPrimitive | CanonicalFilterPrimitive[] | undefined;

type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function normalizePrimitive(v: CanonicalFilterPrimitive): string {
  return String(v).trim();
}

function normalizeValue(value: CanonicalValue): string[] {
  if (value === undefined) return [];

  if (Array.isArray(value)) {
    return value
      .map(normalizePrimitive)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const s = normalizePrimitive(value);
  return s ? [s] : [];
}


export function serializeCanonicalFilters(
  filters: CanonicalFilters
): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  const rec = filters as UnknownRecord;

  for (const [key, raw] of Object.entries(rec)) {
    const values = normalizeValue(raw as CanonicalValue);
    if (!values.length) continue;

    out[key] = values.length === 1 ? values[0] : values;
  }

  return out;
}


export function parseCanonicalFilters(input: unknown): CanonicalFilters {

  const out: CanonicalFilters = { ...DEFAULT_CANONICAL_FILTERS };

  if (!isRecord(input)) return out;

  const outRec = out as UnknownRecord;

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "string") {
      const s = value.trim();
      if (s) outRec[key] = s;
      continue;
    }

    if (Array.isArray(value)) {
      const arr: CanonicalFilterPrimitive[] = value
        .filter((x): x is CanonicalFilterPrimitive => {
          return typeof x === "string" || typeof x === "number" || typeof x === "boolean";
        })
        .map((x) => (typeof x === "string" ? x.trim() : x));

      if (arr.length) outRec[key] = arr;
      continue;
    }
  }

  return out;
}

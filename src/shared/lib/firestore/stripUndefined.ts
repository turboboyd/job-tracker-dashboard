function stripUndefined<T extends Record<string, any>>(obj: T): T {
  const out: any = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v && typeof v === "object" && !("toDate" in v) && !(v instanceof Date)) {

      out[k] = stripUndefined(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}
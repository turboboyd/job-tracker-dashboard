type MaybeWithMessage = { message?: unknown; data?: unknown };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export function normalizeError(error: unknown): string {
  if (!error) return "Unknown error";

  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  if (isObject(error)) {
    const e = error as MaybeWithMessage;

    if (typeof e.message === "string") return e.message;

    // RTK Query often: { data: { message } }
    if (isObject(e.data)) {
      const data = e.data as MaybeWithMessage;
      if (typeof data.message === "string") return data.message;
    }

    // sometimes: { error: "..." }
    if (typeof error["error"] === "string") return String(error["error"]);
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

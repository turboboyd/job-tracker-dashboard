export function getErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";

  if (typeof err === "string") return err;

  if (err instanceof Error) return err.message;

  if (typeof err === "object") {
    const e = err as Record<string, unknown>;
    const data = e["data"] as Record<string, unknown> | undefined;

    const msgFromData =
      data?.["message"] ??
      data?.["error"] ??
      data?.["detail"] ??
      data?.["title"];

    if (typeof msgFromData === "string" && msgFromData.trim()) {
      return msgFromData;
    }

    const msg = e["error"] ?? e["message"];
    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }

    const errors = data?.["errors"];
    if (Array.isArray(errors) && errors.length) {
      const first = errors[0];

      if (typeof first === "string") return first;

      if (first && typeof first === "object") {
        const m = (first as Record<string, unknown>)["message"];
        if (typeof m === "string") return m;
      }
    }
  }

  return "Unknown error";
}

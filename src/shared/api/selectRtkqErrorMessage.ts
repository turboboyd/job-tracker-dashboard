import type { SerializedError } from "@reduxjs/toolkit";

import type { ApiError } from "./rtkError";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}


export function selectRtkqErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (isRecord(error) && typeof (error as ApiError).message === "string") {
    const msg = (error as ApiError).message.trim();
    if (msg) return msg;
  }

  if (
    isRecord(error) &&
    typeof (error as SerializedError).message === "string"
  ) {
    const msg = ((error as SerializedError).message ?? "").trim();
    if (msg) return msg;
  }

  if (isRecord(error)) {
    const data = error["data"];
    if (isRecord(data) && typeof data["message"] === "string") {
      const msg = String(data["message"]).trim();
      if (msg) return msg;
    }

    if (typeof error["error"] === "string") {
      const msg = String(error["error"]).trim();
      if (msg) return msg;
    }

    const nested = error["error"];
    if (isRecord(nested) && typeof nested["message"] === "string") {
      const msg = String(nested["message"]).trim();
      if (msg) return msg;
    }
  }


  if (error instanceof Error) {
    const msg = error.message.trim();
    if (msg) return msg;
  }

  return null;
}

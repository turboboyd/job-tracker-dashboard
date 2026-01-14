export function normalizeError(error: unknown): string {
  if (!error) return "Unknown error";

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  const anyError = error as any;

  if (typeof anyError?.message === "string") {
    return anyError.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

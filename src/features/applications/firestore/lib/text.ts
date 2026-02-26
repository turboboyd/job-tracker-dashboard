/**
 * Stable lightweight hash for fingerprinting.
 * (Not cryptographic; good enough for roleFingerprint dedupe.)
 */
export function djb2Hash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  // convert to unsigned 32-bit and base36
  return (hash >>> 0).toString(36);
}

export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9а-яё#+.\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

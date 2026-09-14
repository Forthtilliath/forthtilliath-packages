/**
 * Deep clones a value.
 *
 * Uses the native `structuredClone` when available (handles `Date`, `Map`,
 * `Set`, circular references, etc.), and falls back to a JSON round-trip
 * otherwise — which loses `undefined` values, functions, and non-JSON types.
 *
 * @param value - The value to clone.
 * @returns A deep copy of `value`.
 */
export function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

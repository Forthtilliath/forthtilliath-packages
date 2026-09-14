/**
 * Creates a new object composed of only the specified keys.
 *
 * @param obj - The source object.
 * @param keys - The keys to keep.
 * @returns A new object containing only `keys`.
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ["a", "c"]); // => { a: 1, c: 3 }
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

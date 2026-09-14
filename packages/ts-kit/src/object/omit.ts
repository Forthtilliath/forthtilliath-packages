/**
 * Creates a new object without the specified keys.
 *
 * @param obj - The source object.
 * @param keys - The keys to remove.
 * @returns A new object without `keys`.
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ["b"]); // => { a: 1, c: 3 }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    Reflect.deleteProperty(result, key);
  }
  return result;
}

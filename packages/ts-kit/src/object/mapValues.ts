/**
 * Creates a new object with the same keys, mapping each value through `fn`.
 *
 * @param obj - The source object.
 * @param fn - Maps a value (and its key) to a new value.
 * @returns A new object with transformed values.
 * @example
 * mapValues({ a: 1, b: 2 }, (n) => n * 2); // => { a: 2, b: 4 }
 */
export function mapValues<T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R,
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;
  for (const key of Object.keys(obj) as (keyof T)[]) {
    result[key] = fn(obj[key], key);
  }
  return result;
}

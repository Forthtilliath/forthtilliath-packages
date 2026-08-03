/**
 * Recursively flattens a nested array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to flatten.
 * @return {T[]} The flattened array.
 */
export function flattenDeep<T>(array: T[]): T[] {
  return array.reduce<T[]>(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    [],
  );
}

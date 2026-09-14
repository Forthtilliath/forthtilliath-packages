/**
 * Groups the elements of an array by a key derived from each element.
 *
 * @param array - The array to group.
 * @param getKey - Computes the group key for an element.
 * @returns A record mapping each key to the array of matching elements.
 * @example
 * groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd"));
 * // => { odd: [1, 3], even: [2, 4] }
 */
export function groupBy<T, K extends PropertyKey>(
  array: readonly T[],
  getKey: (item: T) => K,
): Record<K, T[]> {
  const result: Partial<Record<K, T[]>> = {};
  for (const item of array) {
    const key = getKey(item);
    (result[key] ??= []).push(item);
  }
  return result as Record<K, T[]>;
}

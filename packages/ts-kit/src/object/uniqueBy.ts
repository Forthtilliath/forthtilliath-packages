/**
 * Removes duplicate elements from an array, keeping the first occurrence for
 * each computed key.
 *
 * @param array - The array to deduplicate.
 * @param getKey - Computes the uniqueness key for an element.
 * @returns A new array with only the first element for each key.
 * @example
 * uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], (item) => item.id);
 * // => [{ id: 1 }, { id: 2 }]
 */
export function uniqueBy<T>(
  array: readonly T[],
  getKey: (item: T) => unknown,
): T[] {
  const seen = new Set<unknown>();
  const result: T[] = [];
  for (const item of array) {
    const key = getKey(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

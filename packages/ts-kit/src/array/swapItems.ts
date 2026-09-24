/**
 * Returns a copy of `items` with the elements at positions `i` and `j`
 * swapped (e.g. moving an item up or down in a reorderable list). Never
 * mutates `items`, and stays sound under `noUncheckedIndexedAccess`.
 *
 * @param items - The array to copy.
 * @param i - The position of the first element.
 * @param j - The position of the second element.
 * @returns A new array with both elements swapped, or a plain copy if either
 * position is out of bounds.
 * @example
 * swapItems(["a", "b", "c"], 0, 2); // => ["c", "b", "a"]
 * swapItems(["a", "b", "c"], 0, 5); // => ["a", "b", "c"]
 */
export function swapItems<T>(items: readonly T[], i: number, j: number): T[] {
  const next = [...items];
  const a = next[i];
  const b = next[j];
  if (a === undefined || b === undefined) return next;
  next[i] = b;
  next[j] = a;
  return next;
}

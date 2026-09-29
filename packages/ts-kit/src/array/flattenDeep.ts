/**
 * Recursively flattens a nested array, at any depth.
 *
 * @param array - The array to flatten (left untouched).
 * @returns A new array with every nested element at the top level, typed as
 *   the innermost element type (`number[][][]` → `number[]`).
 * @example
 * flattenDeep([1, [2, [3, [4]]]]); // => [1, 2, 3, 4]
 */
export function flattenDeep<T extends readonly unknown[]>(
  array: T,
): FlatArray<T, 20>[] {
  // 20 is the deepest level the built-in `FlatArray` type can unwind.
  return array.flat(Infinity) as FlatArray<T, 20>[];
}

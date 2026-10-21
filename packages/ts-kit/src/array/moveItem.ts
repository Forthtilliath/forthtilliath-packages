/**
 * Returns a copy of `items` with the element at `from` moved `offset` places
 * (negative = towards the start), the others shifting to make room. When
 * nothing moves (`from` or the destination out of bounds, `offset` 0), the
 * very same array is returned, so a state setter can skip a useless update.
 *
 * @param items - The array to copy.
 * @param from - The position of the element to move.
 * @param offset - How many places to move it.
 * @returns A new array with the element moved, or `items` itself.
 * @example
 * moveItem(["a", "b", "c", "d"], 0, 2); // => ["b", "c", "a", "d"]
 * moveItem(["a", "b", "c"], 2, -1); // => ["a", "c", "b"]
 * moveItem(list, 0, -1) === list; // => true
 */
export function moveItem<T>(items: T[], from: number, offset: number): T[];
export function moveItem<T>(
  items: readonly T[],
  from: number,
  offset: number,
): readonly T[];
export function moveItem<T>(
  items: readonly T[],
  from: number,
  offset: number,
): readonly T[] {
  const to = from + offset;
  const inBounds = (i: number) =>
    Number.isInteger(i) && i >= 0 && i < items.length;
  if (!inBounds(from) || !inBounds(to) || to === from) return items;
  const next = [...items];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
}

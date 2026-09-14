/**
 * Returns the next element in a short list (e.g. cycling through a few
 * recent items on tap). Wraps to the first element if the current one is no
 * longer in the list (deleted, or out of range) or was the last one.
 *
 * @param ids - The list to cycle through.
 * @param currentId - The currently selected id, or `null` for none.
 * @returns The next id, or `null` if `ids` is empty.
 * @example
 * nextInCycle([1, 2, 3], 1); // => 2
 * nextInCycle([1, 2, 3], 3); // => 1
 * nextInCycle([1, 2, 3], null); // => 1
 */
export function nextInCycle(
  ids: number[],
  currentId: number | null,
): number | null {
  if (ids.length === 0) return null;
  const currentIndex = currentId == null ? -1 : ids.indexOf(currentId);
  return ids[(currentIndex + 1) % ids.length] ?? null;
}

/**
 * Indexes items by their `id`, to build once (e.g. in a `useMemo`) and read
 * in O(1) instead of a `find` per rendered element (games × their players).
 * With duplicate ids, the last item wins.
 *
 * @param items - The items to index.
 * @returns A read-only map from each `id` to its item.
 * @example
 * const players = indexById([{ id: "a", name: "Ann" }]);
 * players.get("a")?.name; // => "Ann"
 */
export function indexById<T extends { id: unknown }>(
  items: readonly T[],
): ReadonlyMap<T["id"], T> {
  return new Map(items.map((item) => [item.id, item]));
}

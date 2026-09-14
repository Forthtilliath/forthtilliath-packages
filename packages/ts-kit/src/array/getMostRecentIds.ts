export interface RecentIdRow {
  id: number | null;
  occurredAt: string;
}

const DEFAULT_LIMIT = 5;

/**
 * Returns the most recently occurring distinct ids, most recent first —
 * useful for a "recents" picker (a food, a container, or any other dated
 * entity). Rows with a `null` id (a reference deleted since) are ignored:
 * there's nothing left to offer for them.
 *
 * @param rows - Rows carrying an id (or `null`) and an ISO/parsable date.
 * @param limit - Max number of ids to return. Defaults to `5`.
 * @returns Distinct ids, most recent first, limited to `limit`.
 * @example
 * getMostRecentIds([
 *   { id: 1, occurredAt: "2026-01-01T00:00:00.000Z" },
 *   { id: 2, occurredAt: "2026-01-03T00:00:00.000Z" },
 * ]); // => [2, 1]
 */
export function getMostRecentIds(
  rows: RecentIdRow[],
  limit = DEFAULT_LIMIT,
): number[] {
  const sorted = [...rows].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );
  const seen = new Set<number>();
  const result: number[] = [];
  for (const row of sorted) {
    if (row.id == null || seen.has(row.id)) continue;
    seen.add(row.id);
    result.push(row.id);
    if (result.length >= limit) break;
  }
  return result;
}

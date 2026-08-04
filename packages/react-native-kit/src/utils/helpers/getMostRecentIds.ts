export interface RecentIdRow {
  id: number | null;
  occurredAt: string;
}

const DEFAULT_LIMIT = 5;

// Ids distincts les plus récents, du plus récent au plus ancien — utile pour
// un sélecteur "récents" (aliment, récipient, ou tout autre entité datée).
// `id` peut être null (référence supprimée depuis) : ignoré, on ne peut plus
// le proposer.
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

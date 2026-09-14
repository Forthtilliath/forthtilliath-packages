import { normalizeForSearch } from "../string/normalizeForSearch.js";

// Caches each item's normalized name by object reference: useful for fixed
// lists (module-level constants) searched on every keystroke in a search
// field, to avoid renormalizing every name on each call.
const normalizedNameCache = new WeakMap<object, string>();

function getNormalizedName<T>(item: T, getName: (item: T) => string): string {
  if (typeof item !== "object" || item === null)
    return normalizeForSearch(getName(item));
  const cached = normalizedNameCache.get(item);
  if (cached !== undefined) return cached;
  const normalized = normalizeForSearch(getName(item));
  normalizedNameCache.set(item, normalized);
  return normalized;
}

/**
 * Ranks `items` by relevance to a text search: match position in the name
 * (earlier is more relevant), then name length. Generic so it can be reused
 * for any list of items with a displayable name — typically for a
 * search-as-you-type list.
 *
 * @param items - The items to rank.
 * @param query - The search text.
 * @param getName - Reads the displayable name off an item.
 * @returns Only the matching items, ranked most relevant first.
 * @example
 * rankByNameMatch(
 *   [{ label: "Salad with potato" }, { label: "Potato" }],
 *   "potato",
 *   (item) => item.label,
 * ); // => [{ label: "Potato" }, { label: "Salad with potato" }]
 */
export function rankByNameMatch<T>(
  items: T[],
  query: string,
  getName: (item: T) => string,
): T[] {
  const normalizedQuery = normalizeForSearch(query);
  const matches: { item: T; matchIndex: number }[] = [];
  for (const item of items) {
    const matchIndex = getNormalizedName(item, getName).indexOf(
      normalizedQuery,
    );
    if (matchIndex !== -1) {
      matches.push({ item, matchIndex });
    }
  }
  matches.sort(
    (a, b) =>
      a.matchIndex - b.matchIndex ||
      getName(a.item).length - getName(b.item).length,
  );
  return matches.map((m) => m.item);
}

import { normalizeForSearch } from "./normalizeForSearch.js";

// Cache le nom normalisé de chaque élément par référence d'objet : utile pour
// des listes figées (constantes de module) cherchées à chaque frappe clavier
// dans un champ de recherche, pour éviter de renormaliser tous les noms à
// chaque appel.
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

// Classe des éléments par pertinence vis-à-vis d'une recherche texte :
// position du match dans le nom (plus tôt = plus pertinent), puis longueur
// du nom. Générique pour être réutilisable par n'importe quelle liste
// d'éléments ayant un nom affichable.
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

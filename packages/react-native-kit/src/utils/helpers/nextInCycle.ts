// Élément suivant dans une liste courte (ex: cycler sur tap entre quelques
// éléments récents). Reprend au début si l'actuel n'y est plus (supprimé, ou
// hors de la liste) ou si on est en bout de liste.
export function nextInCycle(
  ids: number[],
  currentId: number | null,
): number | null {
  if (ids.length === 0) return null;
  const currentIndex = currentId == null ? -1 : ids.indexOf(currentId);
  return ids[(currentIndex + 1) % ids.length] ?? null;
}

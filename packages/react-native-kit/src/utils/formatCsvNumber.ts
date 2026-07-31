// Nombre brut (pas de suffixe d'unité) pour rester exploitable dans un
// tableur (somme, moyenne...), avec la virgule décimale attendue par Excel
// en locale française plutôt que le point de JS.
export function formatCsvNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals).replace(".", ",");
}

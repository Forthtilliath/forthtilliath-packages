// Échappe un champ CSV (RFC 4180) : entoure de guillemets et double les
// guillemets internes si la valeur contient un guillemet, un point-virgule
// (délimiteur) ou un saut de ligne — sinon la valeur est renvoyée telle quelle.
export function escapeCsvField(value: string): string {
  if (!/[";\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

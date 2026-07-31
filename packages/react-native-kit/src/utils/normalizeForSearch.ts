// Les ligatures œ/æ ne se décomposent PAS via normalize("NFD") (contrairement
// aux lettres accentuées) : ce sont des lettres Unicode à part entière, pas
// une base + un signe combinant. Sans ce remplacement explicite, chercher
// "Œuf" (avec la vraie ligature) ne trouve jamais "Oeuf" dans une base qui
// l'orthographie sans ligature (comme la plupart des bases de données texte).
function expandLigatures(text: string): string {
  return text.replace(/[œŒ]/g, "oe").replace(/[æÆ]/g, "ae");
}

export function normalizeForSearch(text: string): string {
  return expandLigatures(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

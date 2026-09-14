// The œ/æ ligatures do NOT decompose via normalize("NFD") (unlike accented
// letters): they're standalone Unicode letters, not a base + combining mark.
// Without this explicit replacement, searching "Œuf" (the real ligature)
// never matches "Oeuf" in data spelled without the ligature (as most text
// databases are).
function expandLigatures(text: string): string {
  return text.replace(/[œŒ]/g, "oe").replace(/[æÆ]/g, "ae");
}

/**
 * Normalizes text for accent/case-insensitive search matching: expands
 * œ/æ ligatures, strips accents, lower-cases, and trims.
 *
 * @param text - The text to normalize.
 * @returns The normalized text.
 * @example
 * normalizeForSearch("Pâtes À La Crème"); // => "pates a la creme"
 * normalizeForSearch("Œuf"); // => "oeuf"
 */
export function normalizeForSearch(text: string): string {
  return expandLigatures(text)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Escapes the characters that have a meaning in a regular expression, so a
 * value (a slug, a user's search, a domain…) can be embedded literally in a
 * pattern built with `new RegExp`.
 *
 * @param text - The text to match literally.
 * @returns `text` with `. * + ? ^ $ { } ( ) | [ ] \` backslash-escaped.
 * @example
 * new RegExp(`/manga/${escapeRegExp("solo-leveling (2)")}/chapitre-(\\d+)`);
 * escapeRegExp("a.b*c"); // => "a\\.b\\*c"
 */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

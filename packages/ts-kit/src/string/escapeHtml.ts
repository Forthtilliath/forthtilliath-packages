/**
 * Escapes the HTML entities that matter when inserting arbitrary text into
 * an HTML template (`&`, `<`, `>`, `"`), without pulling in a templating
 * dependency.
 *
 * @param text - The text to escape.
 * @returns `text` with `&`, `<`, `>` and `"` replaced by their HTML entities.
 * @example
 * escapeHtml("Tom & Jerry <script>"); // => "Tom &amp; Jerry &lt;script&gt;"
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

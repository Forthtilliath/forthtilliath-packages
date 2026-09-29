/**
 * Escapes the HTML special characters (`&`, `<`, `>`, `"`, `'`) when
 * inserting arbitrary text into an HTML template, without pulling in a
 * templating dependency. Safe in text content and in attribute values,
 * whether they're quoted with `"` or `'`.
 *
 * @param text - The text to escape.
 * @returns `text` with `&`, `<`, `>`, `"` and `'` replaced by HTML entities.
 * @example
 * escapeHtml("Tom & Jerry <script>"); // => "Tom &amp; Jerry &lt;script&gt;"
 * escapeHtml("it's"); // => "it&#39;s"
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

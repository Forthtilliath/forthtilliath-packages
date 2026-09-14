/**
 * Converts a string into a URL-friendly slug: lower-cased, accents removed,
 * non-alphanumeric runs collapsed into single hyphens.
 *
 * @param str - The string to slugify.
 * @returns The slugified string.
 * @example
 * slugify("Héllo, World!"); // => "hello-world"
 * slugify("  Multiple   spaces  "); // => "multiple-spaces"
 */
export function slugify(str: string): string {
  return str
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

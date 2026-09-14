/**
 * Pluralizes a word based on a count, with a naive English default (`s`
 * suffix, `y` → `ies`, `es` after `s`/`x`/`z`/`sh`/`ch`) or an explicit
 * plural form for irregular words.
 *
 * @param count - The count driving singular vs. plural.
 * @param singular - The singular form.
 * @param plural - An explicit plural form (overrides the naive default).
 * @returns `singular` when `count` is 1 or -1, otherwise the plural form.
 * @example
 * pluralize(1, "item"); // => "item"
 * pluralize(3, "item"); // => "items"
 * pluralize(3, "city"); // => "cities"
 * pluralize(2, "child", "children"); // => "children"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
): string {
  if (Math.abs(count) === 1) return singular;
  if (plural !== undefined) return plural;
  if (/[sxz]$|[cs]h$/i.test(singular)) return `${singular}es`;
  if (/[^aeiou]y$/i.test(singular)) return `${singular.slice(0, -1)}ies`;
  return `${singular}s`;
}

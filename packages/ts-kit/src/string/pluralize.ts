export interface PluralizeOptions {
  /** An explicit plural form (overrides the default suffix rules). */
  plural?: string;
  /**
   * The locale deciding which counts take the singular (defaults to `"en"`):
   * only ±1 in English, but also 0 and 1.5 in French.
   */
  locale?: string;
}

const pluralRules = new Map<string, Intl.PluralRules>();

function takesSingular(count: number, locale: string): boolean {
  let rules = pluralRules.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(locale);
    pluralRules.set(locale, rules);
  }
  return rules.select(count) === "one";
}

function defaultPlural(singular: string, locale: string): string {
  const language = locale.split("-")[0]?.toLowerCase();
  if (language === "fr") {
    return /[sxz]$/i.test(singular) ? singular : `${singular}s`;
  }
  if (language === "en") {
    if (/[sxz]$|[cs]h$/i.test(singular)) return `${singular}es`;
    if (/[^aeiou]y$/i.test(singular)) return `${singular.slice(0, -1)}ies`;
  }
  return `${singular}s`;
}

/**
 * Pluralizes a word based on a count. Which counts take the singular follows
 * the locale's plural rules (`Intl.PluralRules`). Without an explicit plural
 * form, the default suffix is naive: in English `s`, `y` → `ies`, `es` after
 * `s`/`x`/`z`/`sh`/`ch`; in French `s`, nothing after `s`/`x`/`z`; `s` in
 * any other language.
 *
 * @param count - The count driving singular vs. plural.
 * @param singular - The singular form.
 * @param options - An explicit plural form, or `{ plural?, locale? }`.
 * @returns The singular or plural form.
 * @example
 * pluralize(1, "item"); // => "item"
 * pluralize(3, "city"); // => "cities"
 * pluralize(2, "child", "children"); // => "children"
 * pluralize(0, "chant", { locale: "fr" }); // => "chant"
 * pluralize(2, "journal", { plural: "journaux", locale: "fr" }); // => "journaux"
 */
export function pluralize(
  count: number,
  singular: string,
  options?: string | PluralizeOptions,
): string {
  const { plural, locale = "en" } =
    typeof options === "string" ? { plural: options } : (options ?? {});
  if (takesSingular(count, locale)) return singular;
  return plural ?? defaultPlural(singular, locale);
}

/**
 * Returns `pluralize` bound to a locale, to declare once per app.
 *
 * @param locale - The locale of every call.
 * @returns `(count, singular, plural?) => string`.
 * @example
 * const plural = createPluralize("fr");
 * plural(0, "chant"); // => "chant"
 * plural(2, "est", "sont"); // => "sont"
 */
export function createPluralize(locale: string) {
  return (count: number, singular: string, plural?: string): string =>
    pluralize(count, singular, { plural, locale });
}

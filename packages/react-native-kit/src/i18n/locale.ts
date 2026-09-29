import { createContext, use } from "react";

/** Languages the kit's built-in labels are available in. */
export type KitLocale = "fr" | "en";

/** Used when neither a `locale` prop nor a `KitLocaleProvider` sets one. */
export const DEFAULT_KIT_LOCALE: KitLocale = "fr";

/** BCP 47 tags matching each locale, for `Intl` dates and speech recognition. */
export const KIT_LOCALE_TAGS: Record<KitLocale, string> = {
  fr: "fr-FR",
  en: "en-US",
};

/** Provided by `KitLocaleProvider`, read by {@link useKitLocale}. */
export const KitLocaleContext = createContext<KitLocale>(DEFAULT_KIT_LOCALE);

/**
 * Resolves the locale a component renders its built-in labels in: its own
 * `locale` prop, else the nearest `KitLocaleProvider`, else French.
 */
export function useKitLocale(locale?: KitLocale): KitLocale {
  const contextLocale = use(KitLocaleContext);
  return locale ?? contextLocale;
}

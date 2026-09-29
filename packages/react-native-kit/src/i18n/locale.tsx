import { createContext, type ReactNode, useContext } from "react";

/** Languages the kit's built-in labels are available in. */
export type KitLocale = "fr" | "en";

/** Used when neither a `locale` prop nor a {@link KitLocaleProvider} sets one. */
export const DEFAULT_KIT_LOCALE: KitLocale = "fr";

/** BCP 47 tags matching each locale, for `Intl` dates and speech recognition. */
export const KIT_LOCALE_TAGS: Record<KitLocale, string> = {
  fr: "fr-FR",
  en: "en-US",
};

const KitLocaleContext = createContext<KitLocale>(DEFAULT_KIT_LOCALE);

export interface KitLocaleProviderProps {
  locale: KitLocale;
  children: ReactNode;
}

/**
 * Sets the language of every kit component's built-in labels below it — for
 * a bilingual app, switch it once here instead of passing `locale` to each
 * component. A component's own `locale` prop still wins, and its `labels`
 * prop still overrides individual strings.
 *
 * @example
 * <KitLocaleProvider locale={userLanguage}>
 *   <App />
 * </KitLocaleProvider>
 */
export function KitLocaleProvider({
  locale,
  children,
}: KitLocaleProviderProps) {
  return <KitLocaleContext value={locale}>{children}</KitLocaleContext>;
}

/**
 * Resolves the locale a component renders its built-in labels in: its own
 * `locale` prop, else the nearest {@link KitLocaleProvider}, else French.
 */
export function useKitLocale(locale?: KitLocale): KitLocale {
  const contextLocale = useContext(KitLocaleContext);
  return locale ?? contextLocale;
}

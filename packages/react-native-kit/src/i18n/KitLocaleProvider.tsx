import type { ReactNode } from "react";

import { type KitLocale, KitLocaleContext } from "./locale.js";

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

"use client";

import type { ReactNode } from "react";

import { type UiLocale, UiLocaleContext } from "./locale.js";

/** Props of {@link UiLocaleProvider}. */
export interface UiLocaleProviderProps {
  /** Language of the built-in labels of every component below. */
  locale: UiLocale;
  /** The part of the app it applies to (usually the whole app). */
  children: ReactNode;
}

/**
 * Sets the language of every forth-ui component's built-in labels below it
 * — for a bilingual site, switch it once here instead of passing `locale` to
 * each component. A component's own `locale` prop still wins, and its text
 * props (`placeholder`, `emptyMessage`…) still override individual strings.
 *
 * @example
 * <UiLocaleProvider locale={lang}>
 *   {children}
 * </UiLocaleProvider>
 */
export function UiLocaleProvider({ locale, children }: UiLocaleProviderProps) {
  return <UiLocaleContext value={locale}>{children}</UiLocaleContext>;
}

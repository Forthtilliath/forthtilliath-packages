"use client";

import { createContext, use } from "react";

import { UI_MESSAGES, type UiMessages } from "./messages.js";

/** Languages forth-ui's built-in labels are available in. */
export type UiLocale = "fr" | "en";

/** Used when neither a `locale` prop nor a `UiLocaleProvider` sets one. */
export const DEFAULT_UI_LOCALE: UiLocale = "fr";

/** Provided by `UiLocaleProvider`, read by {@link useUiLocale}. */
export const UiLocaleContext = createContext<UiLocale>(DEFAULT_UI_LOCALE);

/**
 * Resolves the locale a component renders its built-in labels in: its own
 * `locale` prop, else the nearest `UiLocaleProvider`, else French.
 */
export function useUiLocale(locale?: UiLocale): UiLocale {
  const contextLocale = use(UiLocaleContext);
  return locale ?? contextLocale;
}

/** The built-in labels of the resolved locale (see {@link useUiLocale}). */
export function useUiMessages(locale?: UiLocale): UiMessages {
  return UI_MESSAGES[useUiLocale(locale)];
}

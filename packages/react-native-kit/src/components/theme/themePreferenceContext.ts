import { createContext, use } from "react";

import {
  type ThemePreference,
  useEffectiveColorScheme,
} from "../../hooks/useEffectiveColorScheme.js";

export interface ThemePreferenceContextValue {
  /** The user's choice: light, dark, or follow the system. */
  preference: ThemePreference;
  /** Applies a new choice right away, then persists it through `save`. */
  setPreference: (preference: ThemePreference) => void;
}

/**
 * Provided by `ThemePreferenceProvider`, read through
 * {@link useThemePreference}; `"system"` outside a provider.
 */
export const ThemePreferenceContext =
  createContext<ThemePreferenceContextValue>({
    preference: "system",
    setPreference: () => undefined,
  });

/** The theme preference and its setter, from the nearest `ThemePreferenceProvider`. */
export function useThemePreference(): ThemePreferenceContextValue {
  return use(ThemePreferenceContext);
}

/**
 * The scheme actually applied: the chosen one, or the device's when the
 * preference is `"system"`.
 */
export function useResolvedScheme(): "light" | "dark" {
  return useEffectiveColorScheme(useThemePreference().preference);
}

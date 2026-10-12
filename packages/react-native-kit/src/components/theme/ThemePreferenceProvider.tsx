import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ThemePreference } from "../../hooks/useEffectiveColorScheme.js";

import { ThemePreferenceContext } from "./themePreferenceContext.js";

export interface ThemePreferenceProviderProps {
  children: ReactNode;
  /**
   * Reads the saved preference once, on mount. Resolve to `null` /
   * `undefined` when nothing is saved yet: `initialPreference` then stays.
   */
  load: () => Promise<ThemePreference | null | undefined>;
  /** Persists a new preference (AsyncStorage, SQLite, a settings row…). */
  save: (preference: ThemePreference) => void | Promise<void>;
  /**
   * Used until `load` resolves, and when nothing is saved.
   *
   * @defaultValue "system"
   */
  initialPreference?: ThemePreference;
}

/**
 * Holds the app's light / dark / system theme preference in a context:
 * loaded from storage on mount, changeable from anywhere through
 * `useThemePreference`, persisted on change. Storage-agnostic — the app
 * passes its own `load` / `save`. Pair it with `ThemeSettingsScreen` for the
 * settings screen and `useResolvedScheme` to pick the palette.
 *
 * @example
 * ```tsx
 * import { ThemePreferenceProvider } from "@forthtilliath/react-native-kit/components/theme/ThemePreferenceProvider";
 *
 * <ThemePreferenceProvider
 *   load={async () => (await getSettings()).theme}
 *   save={async (theme) => saveSettings({ ...(await getSettings()), theme })}
 * >
 *   <App />
 * </ThemePreferenceProvider>
 * ```
 */
export function ThemePreferenceProvider({
  children,
  load,
  save,
  initialPreference = "system",
}: ThemePreferenceProviderProps) {
  const [preference, setPreference] =
    useState<ThemePreference>(initialPreference);
  // Latest callbacks, so inline `load` / `save` props neither re-run the
  // initial load nor go stale.
  const loadRef = useRef(load);
  const saveRef = useRef(save);
  // Set by a user choice made before `load` resolved: the slower stored
  // value must not overwrite it.
  const chosenRef = useRef(false);

  useEffect(() => {
    loadRef.current = load;
    saveRef.current = save;
  });

  useEffect(() => {
    let active = true;
    void loadRef.current().then((stored) => {
      if (active && stored && !chosenRef.current) setPreference(stored);
    });
    return () => {
      active = false;
    };
  }, []);

  const choosePreference = useCallback((next: ThemePreference) => {
    chosenRef.current = true;
    setPreference(next);
    void saveRef.current(next);
  }, []);

  const value = useMemo(
    () => ({ preference, setPreference: choosePreference }),
    [preference, choosePreference],
  );

  return (
    <ThemePreferenceContext value={value}>{children}</ThemePreferenceContext>
  );
}

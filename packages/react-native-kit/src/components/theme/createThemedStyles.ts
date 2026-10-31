import {
  type ImageStyle,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native";

/** What `StyleSheet.create` accepts: named view, text or image styles. */
export type NamedStyles<T> = {
  [K in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

/**
 * Turns `factory(palette)` into a hook that computes it **once per palette**
 * and shares the result between every component and every render — instead
 * of a `useMemo` per mounted component. The cache is keyed by the palette
 * object itself (a `WeakMap`): keep palettes as constants (one per theme),
 * not objects rebuilt on each render.
 *
 * @param usePalette - The app's hook returning the current palette.
 * @param factory - Builds the value from a palette.
 * @returns A hook returning the value for the current palette.
 * @example
 * const useChartColors = createPaletteMemo(useColors, (c) => [c.primary, c.accent, c.muted]);
 */
export function createPaletteMemo<P extends object, T>(
  usePalette: () => P,
  factory: (palette: P) => T,
): () => T {
  const cache = new WeakMap<P, T>();
  return function usePaletteMemo() {
    const palette = usePalette();
    if (cache.has(palette)) return cache.get(palette) as T;
    const value = factory(palette);
    cache.set(palette, value);
    return value;
  };
}

/**
 * `StyleSheet.create` in the colors of the current theme, declared once at
 * module level: the returned hook gives one style sheet per palette, created
 * the first time that palette is used, then shared by every instance.
 *
 * @param usePalette - The app's hook returning the current palette
 * (typically picked with `useResolvedScheme()`).
 * @param factory - Builds the styles from a palette.
 * @returns A hook returning the styles for the current palette.
 * @example
 * // ui/theme.ts — once per app
 * export const useColors = () => (useResolvedScheme() === "dark" ? dark : light);
 * export const themedStyles = <T extends NamedStyles<T>>(factory: (c: Palette) => T) =>
 *   createThemedStyles(useColors, factory);
 *
 * // any component
 * const useStyles = themedStyles((c) => ({
 *   card: { backgroundColor: c.card, borderColor: c.border, borderWidth: 1 },
 *   title: { color: c.text, fontWeight: "700" },
 * }));
 *
 * function Card() {
 *   const styles = useStyles();
 *   return <View style={styles.card}>…</View>;
 * }
 */
export function createThemedStyles<P extends object, T extends NamedStyles<T>>(
  usePalette: () => P,
  factory: (palette: P) => T,
): () => T {
  return createPaletteMemo(usePalette, (palette) =>
    StyleSheet.create(factory(palette)),
  );
}

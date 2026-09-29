/**
 * Merges a component's per-slot style overrides onto its defaults, slot by
 * slot, as `[default, override]` style arrays — so overriding one property of
 * a slot (say `button.backgroundColor`) keeps the rest of that slot's default
 * (padding, radius…) instead of replacing it wholesale.
 *
 * Only the slots present in `defaults` are merged; non-style fields of the
 * overrides (icon colors…) are left for the caller to resolve.
 *
 * @param defaults - The default style of each slot.
 * @param overrides - The caller's `styles` prop, if any.
 * @returns For each slot of `defaults`, a `[default, override]` style array.
 * @example
 * const merged = mergeSlotStyles(defaultStyles, styles);
 * <View style={merged.container} />
 */
export function mergeSlotStyles<
  D extends Record<string, object>,
  O extends object,
>(
  defaults: D,
  overrides: O | undefined,
): { [K in keyof D]: [D[K], K extends keyof O ? O[K] : undefined] } {
  const merged: Record<string, unknown[]> = {};
  for (const key of Object.keys(defaults)) {
    merged[key] = [
      defaults[key],
      (overrides as Record<string, unknown> | undefined)?.[key],
    ];
  }
  return merged as {
    [K in keyof D]: [D[K], K extends keyof O ? O[K] : undefined];
  };
}

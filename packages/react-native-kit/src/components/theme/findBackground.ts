/** One background on offer to `BackgroundPicker`, drawn as a page with a card on it. */
export interface BackgroundOption {
  id: string;
  /** Shown under the swatch and read by screen readers. */
  label: string;
  /** The page colour. */
  page: string;
  /** The card drawn on the page. */
  card: string;
  /** The card's border. Defaults to `card`. */
  cardBorder?: string;
}

/**
 * The option with this id, or the first one (the original background) if the
 * id is unknown — a background removed since it was saved, or none saved yet.
 *
 * @throws {RangeError} If `options` is empty.
 */
export function findBackground<T extends BackgroundOption>(
  options: readonly T[],
  id: string | null | undefined,
): T {
  const found = options.find((option) => option.id === id) ?? options[0];
  if (!found) throw new RangeError("findBackground needs at least one option");
  return found;
}

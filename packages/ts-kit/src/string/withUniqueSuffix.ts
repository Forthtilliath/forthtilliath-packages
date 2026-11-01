/** Options of {@link withUniqueSuffix}. */
export interface WithUniqueSuffixOptions {
  /** Placed between the base and the number. Defaults to `"-"`. */
  separator?: string;
  /** First number tried after the base itself. Defaults to `2`. */
  start?: number;
}

/**
 * Returns `base` if it is free, otherwise `base` followed by the first free
 * number (`base-2`, `base-3`…): a unique slug, file or copy name.
 *
 * @param base - The preferred value.
 * @param taken - The values already in use.
 * @param options - See {@link WithUniqueSuffixOptions}.
 * @returns A value absent from `taken`.
 * @example
 * withUniqueSuffix("solo-leveling", ["solo-leveling"]); // => "solo-leveling-2"
 * withUniqueSuffix("photo", ["photo", "photo_1"], { separator: "_", start: 1 }); // => "photo_2"
 */
export function withUniqueSuffix(
  base: string,
  taken: Iterable<string>,
  { separator = "-", start = 2 }: WithUniqueSuffixOptions = {},
): string {
  const used = new Set(taken);
  if (!used.has(base)) return base;

  let suffix = start;
  while (used.has(`${base}${separator}${String(suffix)}`)) suffix++;
  return `${base}${separator}${String(suffix)}`;
}

/**
 * A tuple of exactly `N` elements of type `T` — a 3×3 grid stored flat, the
 * 9 slots of a configuration. `N` must be a non-negative integer literal
 * (TypeScript stops recursing around 1000); a plain `number` gives `T[]`.
 *
 * @example
 * type Slots = FixedLengthArray<string, 3>;
 * //=> [string, string, string]
 * const ok: Slots = ["a", "b", "c"];
 * const tooShort: Slots = ["a", "b"]; //=> error
 */
export type FixedLengthArray<
  T,
  N extends number,
  Acc extends T[] = [],
> = number extends N
  ? T[]
  : Acc["length"] extends N
    ? Acc
    : FixedLengthArray<T, N, [T, ...Acc]>;

/**
 * Adds `null` to T.
 *
 * @example
 * type NullableString = Nullable<string>;
 * //=> string | null
 */
export type Nullable<T> = T | null;

/**
 * Adds `null` and `undefined` to T — the "value possibly absent" shape,
 * common for optional API fields or not-yet-loaded state.
 *
 * @example
 * type MaybeUser = Maybe<User>;
 * //=> User | null | undefined
 */
export type Maybe<T> = T | null | undefined;

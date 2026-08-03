/**
 * Enforces to have at least one element
 *
 * @example
 * type NonEmptyNumberArray = NonEmptyArray<number>;
 * //=> [number, ...number[]]
 * const arr: NonEmptyNumberArray = [1, 2, 3]; //=> ok
 * const arr: NonEmptyNumberArray = []; //=> error
 */
export type NonEmptyArray<T> = [T, ...T[]];

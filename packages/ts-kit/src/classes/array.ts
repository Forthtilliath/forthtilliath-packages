export class FArray<T> extends Array<T> {
  /**
   * Similar to `Array.includes`, but narrows the type of `searchElement` to `Include & T` if it is included in the array.
   *
   * @param searchElement The value to search for.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   * @returns true if the value is found, otherwise false.
   *
   * @example
   * // Normal operation of Array.includes
   * const bar = "bar";
   * type FBB = "foo" | "bar" | "baz";
   * const arr: FBB[] = ["foo", "bar", "baz"];
   * if (arr.includes(bar)) {
   * 	// bar is typed as "bar"
   * } else {
   * 	// bar is typed as "bar"
   * }
   *
   * @example
   * // FArray.includes
   * const bar = "bar";
   * type FBB = "foo" | "bar" | "baz";
   * const arr = new FArray<FBB>("foo", "bar", "baz");
   * if (arr.includes(bar)) {
   * 	// bar is typed as "bar"
   * } else {
   * 	// bar is typed as never
   * }
   *
   * @example
   * // Normal operation of Array.includes
   * const buz = "buz";
   * type FBB = "foo" | "bar" | "baz";
   * const arr: FBB[] = ["foo", "bar", "baz"];
   * if (arr.includes(buz)) {}
   * // ---------------^
   * // The argument of type 'buz' is not assignable to the parameter of type 'FBB'.
   *
   * @example
   * // FArray.includes
   * const buz = "buz";
   * type FBB = "foo" | "bar" | "baz";
   * const arr = new FArray<FBB>("foo", "bar", "baz");
   * if (arr.includes(buz)) {
   * 	// bar is typed as never
   * } else {
   * 	// bar is typed as "buz"
   * }
   */
  includes<S>(searchElement: S | T, fromIndex = 0): searchElement is S & T {
    // @ts-expect-error searchElement is unknown
    return super.includes(searchElement, fromIndex);
  }

  /**
   * Same as `Array.indexOf`, but accepts a search value outside of `T`
   * instead of rejecting it at compile-time (the native typings only accept
   * `T`, exactly like `Array.includes` before the override above).
   *
   * @param searchElement The value to search for — no longer restricted to `T`.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   * @returns The index of the first match, or -1 if not found.
   *
   * @example
   * // Normal operation of Array.indexOf
   * const buz = "buz";
   * type FBB = "foo" | "bar" | "baz";
   * const arr: FBB[] = ["foo", "bar", "baz"];
   * arr.indexOf(buz);
   * // -----------^
   * // The argument of type 'buz' is not assignable to the parameter of type 'FBB'.
   *
   * @example
   * // FArray.indexOf
   * const buz = "buz";
   * type FBB = "foo" | "bar" | "baz";
   * const arr = new FArray<FBB>("foo", "bar", "baz");
   * arr.indexOf(buz); // compiles fine, returns -1
   */
  indexOf(searchElement: unknown, fromIndex = 0): number {
    // @ts-expect-error searchElement is unknown
    return super.indexOf(searchElement, fromIndex);
  }

  /**
   * Same as `Array.lastIndexOf`, but accepts a search value outside of `T`
   * instead of rejecting it at compile-time. See {@link FArray.indexOf}.
   *
   * @param searchElement The value to search for — no longer restricted to `T`.
   * @param fromIndex The position in this array at which to start searching backwards. Defaults to the last index, like the native method.
   * @returns The index of the last match, or -1 if not found.
   */
  lastIndexOf(searchElement: unknown, fromIndex?: number): number {
    if (fromIndex === undefined) {
      // @ts-expect-error searchElement is unknown
      return super.lastIndexOf(searchElement);
    }
    // @ts-expect-error searchElement is unknown
    return super.lastIndexOf(searchElement, fromIndex);
  }

  /**
   * Same as `Array.filter`, but recognizes the `Boolean` global constructor
   * as a type guard — the native typings don't, so `arr.filter(Boolean)`
   * keeps `null`/`undefined` in the result's element type even though
   * they're removed at runtime.
   *
   * Note: like the native runtime behavior, this also drops other falsy
   * values (`0`, `""`, `NaN`, `false`) — but the type only reflects the
   * removal of `null`/`undefined`, since narrowing those further would
   * require them to be literal members of `T`.
   *
   * @example
   * // Normal operation of Array.filter
   * const arr: (number | null | undefined)[] = [1, null, 2, undefined];
   * const result = arr.filter(Boolean); // still (number | null | undefined)[]
   *
   * @example
   * // FArray.filter
   * const arr = new FArray<number | null | undefined>(1, null, 2, undefined);
   * const result = arr.filter(Boolean); // FArray<number>
   */
  filter(predicate: BooleanConstructor): FArray<NonNullable<T>>;
  filter<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S,
    thisArg?: unknown,
  ): FArray<S>;
  filter(
    predicate: (value: T, index: number, array: T[]) => unknown,
    thisArg?: unknown,
  ): FArray<T>;
  filter(predicate: unknown, thisArg?: unknown): FArray<unknown> {
    return super.filter(
      predicate as (value: T, index: number, array: T[]) => unknown,
      thisArg,
    ) as FArray<unknown>;
  }

  /**
   * Same as `Array.from`, but returns an `FArray` — the native typings
   * return a plain `T[]`/`U[]` even though `Array.from` (and `Array.of`
   * below) already construct an instance of the calling class at runtime.
   *
   * @example
   * const fromPlain = FArray.from([1, 2, 3]); // FArray<number>, not number[]
   */
  static from<T>(iterable: Iterable<T> | ArrayLike<T>): FArray<T>;
  static from<T, U>(
    iterable: Iterable<T> | ArrayLike<T>,
    mapfn: (v: T, k: number) => U,
    thisArg?: unknown,
  ): FArray<U>;
  static from<T, U>(
    iterable: Iterable<T> | ArrayLike<T>,
    mapfn?: (v: T, k: number) => U,
    thisArg?: unknown,
  ): FArray<T> | FArray<U> {
    return (
      mapfn ? super.from(iterable, mapfn, thisArg) : super.from(iterable)
    ) as FArray<T> | FArray<U>;
  }

  /**
   * Same as `Array.of`, but returns an `FArray`. See {@link FArray.from}.
   *
   * @example
   * const fa = FArray.of(1, 2, 3); // FArray<number>, not number[]
   */
  static of<T>(...items: T[]): FArray<T> {
    return super.of(...items) as FArray<T>;
  }

  /**
   * Converts this `FArray` back into a plain `Array` instance — the
   * reverse of {@link FArray.from}/{@link FArray.of}. `FArray` is already
   * assignable to `T[]` anywhere a plain array is expected (it extends
   * `Array`), so this is mostly useful when the runtime type matters too
   * (e.g. a library that special-cases `Array` and rejects subclasses).
   *
   * @example
   * const fa = new FArray(1, 2, 3);
   * const plain = fa.toArray(); // Array(3) [1, 2, 3], not instanceof FArray
   */
  toArray(): T[] {
    return [...this];
  }
}

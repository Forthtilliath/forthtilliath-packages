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
}

/**
 * Type of the pairs of keys/values of an object
 *
 * @example
 * const obj = { a: 1, b: 2 };
 * type Entries = ObjectEntries<typeof obj>;
 * //=> [['a', 1], ['b', 2]]
 */
export type Entries<T> = readonly {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

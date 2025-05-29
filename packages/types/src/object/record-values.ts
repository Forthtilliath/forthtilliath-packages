import type { UnknownRecord } from "./unknown-record.js";

/**
 * Type of the values of an object
 *
 * @example
 * const obj = { a: 1, b: 2 };
 * type Values = ObjectValues<typeof obj>;
 * //=> 1 | 2
 */
export type RecordValues<T extends UnknownRecord> = T[keyof T];

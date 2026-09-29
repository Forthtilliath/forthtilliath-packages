import type { Prettify } from "./prettify.js";
import type { UnknownRecord } from "./unknown-record.js";

/**
 * Merges two object types into a single flat object type, `S`'s properties
 * taking priority over `F`'s (like `{ ...f, ...s }` at runtime). Optional and
 * readonly modifiers are kept.
 *
 * Unlike a plain `F & S`, a property both types declare with incompatible
 * types resolves to `S`'s type instead of `never`.
 *
 * @example
 * type A = Merge<{ id: number; name: string }, { name: string[] }>;
 * // A is { id: number; name: string[] }
 *
 * @template F - The base object type.
 * @template S - The object type whose properties override `F`'s.
 */
export type Merge<F extends UnknownRecord, S extends UnknownRecord> = Prettify<
  Omit<F, keyof S> & S
>;

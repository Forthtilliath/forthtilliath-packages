/**
 * Recursively makes all properties of T optional, including nested objects
 * and array items. Functions are left untouched (only their presence stays
 * optional through the parent object, not their signature).
 *
 * @example
 * type User = { name: string; address: { city: string; zip: string } };
 * type PartialUser = DeepPartial<User>;
 * //=> { name?: string; address?: { city?: string; zip?: string } }
 */
export type DeepPartial<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

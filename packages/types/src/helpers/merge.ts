/**
 * Prettify type by removing any intersection types.
 * @example
 * type A = Merge<{ foo: string } & { bar: number }>;
 * // A is { foo: string; bar: number; }
 */
export type Merge<T> = {
  [K in keyof T]: T[K];
} & {};

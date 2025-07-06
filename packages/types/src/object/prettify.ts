/**
 * Prettify type by removing any intersection types.
 * @example
 * type A = { foo: string } & { bar: number };
 * type B = Prettify<A>;
 * // B is { foo: string; bar: number; }
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

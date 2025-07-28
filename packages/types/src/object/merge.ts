/**
 * Prettify type by removing any intersection types.
 * Merges multiple types into a single type by intersecting them.
 * 
 * @example
 * type A = Merge<{ foo: string } & { bar: number }>;
 * // A is { foo: string; bar: number; }
 * 
 * @template T - The type to be merged. Generally, an intersection of object types.
 */
export type Merge<T extends object> = {
  [K in keyof T]: T[K];
};

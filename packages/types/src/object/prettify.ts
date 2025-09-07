/**
 * Forces TypeScript to expand and display the full structure of a type
 * instead of showing the type alias name. This is purely cosmetic and
 * helps with IntelliSense readability.
 *
 * @example
 * type User = { name: string; age: number };
 * type UserWithId = User & { id: string };
 *
 * // Without Prettify: shows as "User & { id: string }"
 * // With Prettify: shows as "{ name: string; age: number; id: string }"
 * type PrettyUser = Prettify<UserWithId>;
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & NonNullable<unknown>;

/**
 * Get keys of object that match a type
 * @example
 * type User = {
 *   name: string;
 *   age: number;
 *   subscribed: boolean;
 *   genre: "male" | "female";
 *   mail: string;
 * };
 * type UserStringKeys = KeysMatching<User, string>;
 * // UserStringKeys is "name" | "genre" | "mail"
 */
export type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

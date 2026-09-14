/**
 * Creates a nominal ("branded") type from T, preventing accidental mixing
 * of values that share the same underlying type (e.g. a `UserId` and a
 * `ProductId` both being plain `string`).
 *
 * The brand only exists at compile time — at runtime a `Brand<string,
 * "UserId">` is still a plain string, so values must be branded at creation
 * with a type assertion (or a small factory function).
 *
 * @example
 * type UserId = Brand<string, "UserId">;
 * type ProductId = Brand<string, "ProductId">;
 *
 * const userId = "u1" as UserId;
 * function getUser(id: UserId) { ... }
 *
 * getUser(userId); //=> ok
 * getUser("u1"); //=> error: plain string is not assignable to UserId
 * getUser("p1" as ProductId); //=> error: different brand
 */
export type Brand<T, B extends string | symbol> = T & { readonly __brand: B };

/**
 * Alias of {@link Brand} — some libraries (and type-fest) call this pattern
 * "Opaque" instead of "branded".
 */
export type Opaque<T, B extends string | symbol> = Brand<T, B>;

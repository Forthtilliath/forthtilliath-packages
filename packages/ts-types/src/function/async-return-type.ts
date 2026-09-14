/**
 * Extracts the resolved value type of an async function, unwrapping the
 * `Promise`. Equivalent to `Awaited<ReturnType<T>>` but reads better at the
 * call site and constrains T to async functions only.
 *
 * @example
 * async function fetchUser() {
 *   return { id: 1, name: "Ada" };
 * }
 * type User = AsyncReturnType<typeof fetchUser>;
 * //=> { id: number; name: string }
 */
export type AsyncReturnType<T extends (...args: never[]) => Promise<unknown>> =
  T extends (...args: never[]) => Promise<infer R> ? R : never;

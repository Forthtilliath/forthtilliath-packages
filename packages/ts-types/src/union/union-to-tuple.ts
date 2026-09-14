/**
 * Converts a union type into a tuple containing each member once. Useful to
 * get an array-like representation of a union (e.g. to iterate over it at
 * runtime with `as const`, or to feed it to a function that expects a
 * tuple).
 *
 * ⚠️ The resulting member order is not guaranteed to match declaration
 * order (it depends on TypeScript's internal union-to-intersection
 * conversion), and very large unions (~50+ members) can hit the compiler's
 * recursion limit. Prefer it for small, stable unions (enum-like string
 * literals, discriminants...).
 *
 * @example
 * type Status = "idle" | "loading" | "error";
 * type StatusTuple = UnionToTuple<Status>;
 * //=> ["idle", "loading", "error"] (order not guaranteed)
 */
export type UnionToTuple<
  T,
  Last = LastOfUnion<T>,
  IsDone = [T] extends [never] ? true : false,
> = IsDone extends true ? [] : [...UnionToTuple<Exclude<T, Last>>, Last];

type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never;

type LastOfUnion<U> =
  UnionToIntersection<U extends unknown ? () => U : never> extends () => infer R
    ? R
    : never;

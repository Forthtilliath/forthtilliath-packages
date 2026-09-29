// Compile-time assertions for this package's type tests: `pnpm run
// check-types` fails if any `Expect<Equal<A, B>>` doesn't hold, or if an
// `@ts-expect-error` line stops erroring. Excluded from the build.

/** `true` only if `A` and `B` are identical (not just mutually assignable). */
// The single-use `T` of each function type is the point of this trick: it
// makes the compiler compare `A` and `B` by identity.
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
/* eslint-enable @typescript-eslint/no-unnecessary-type-parameters */

/** Fails to compile unless `T` is `true`. */
export type Expect<T extends true> = T;

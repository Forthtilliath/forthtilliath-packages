/**
 * Recursively makes all properties of T readonly, including nested objects
 * and array items. Functions are left untouched.
 *
 * @example
 * type Config = { api: { url: string; retries: number } };
 * type ReadonlyConfig = DeepReadonly<Config>;
 * //=> { readonly api: { readonly url: string; readonly retries: number } }
 */
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

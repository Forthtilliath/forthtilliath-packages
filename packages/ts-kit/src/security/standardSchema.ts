/**
 * The subset of the [Standard Schema](https://standardschema.dev) interface
 * this package reads: implemented by zod (3.24+ and 4), Valibot, ArkType… so
 * {@link parseUntrustedJson} takes any of them without depending on one.
 */
export interface StandardSchemaV1<Output = unknown> {
  /**
   * The Standard Schema interface every compatible library exposes (zod ≥ 3.24,
   * valibot, arktype…): only `validate` is used here.
   */
  readonly "~standard": {
    readonly version: 1;
    readonly vendor: string;
    readonly validate: (
      value: unknown,
    ) => StandardSchemaResult<Output> | Promise<StandardSchemaResult<Output>>;
  };
}

/** A path segment as schemas report it: a key, or `{ key }`. */
export type StandardSchemaPathSegment =
  PropertyKey | { readonly key: PropertyKey };

/** One validation problem reported by a Standard Schema. */
export interface StandardSchemaIssue {
  /** The schema's own message (in the schema library's language). */
  readonly message: string;
  /** Where the problem is, from the root value; absent for the root itself. */
  readonly path?: readonly StandardSchemaPathSegment[];
}

/**
 * What a Standard Schema's `validate` returns: the output `value`, or the list
 * of `issues`.
 */
export type StandardSchemaResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly issues: readonly StandardSchemaIssue[] };

/** The output type of a Standard Schema (`z.infer` for a zod schema). */
export type InferSchemaOutput<S> =
  S extends StandardSchemaV1<infer O> ? O : never;

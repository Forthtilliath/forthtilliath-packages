/**
 * The subset of the [Standard Schema](https://standardschema.dev) interface
 * this package reads: implemented by zod (3.24+ and 4), Valibot, ArkType… so
 * {@link parseUntrustedJson} takes any of them without depending on one.
 */
export interface StandardSchemaV1<Output = unknown> {
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

export interface StandardSchemaIssue {
  readonly message: string;
  readonly path?: readonly StandardSchemaPathSegment[];
}

export type StandardSchemaResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly issues: readonly StandardSchemaIssue[] };

/** The output type of a Standard Schema (`z.infer` for a zod schema). */
export type InferSchemaOutput<S> =
  S extends StandardSchemaV1<infer O> ? O : never;

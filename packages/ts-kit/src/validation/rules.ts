/** A check on a single untrusted value (a cell of an imported record). */
export type Rule = (value: unknown) => boolean;

/** How one field of a record is checked; see `required` / `optional`. */
export interface FieldSpec {
  rule: Rule;
  required?: boolean;
}

/** Field name → spec. Fields left out of the spec are dropped from the output. */
export type RecordSpec = Record<string, FieldSpec>;

/** A finite number (rejects `NaN`, `Infinity` and numeric strings). */
export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/** Any integer, negative included. */
export const isInteger: Rule = (value) => Number.isInteger(value);

/** A strictly positive integer — the shape of an auto-increment id. */
export const isPositiveInteger: Rule = (value) =>
  Number.isInteger(value) && (value as number) > 0;

export const isString: Rule = (value) => typeof value === "string";

export const isBoolean: Rule = (value) => typeof value === "boolean";

/**
 * A string of at most `max` characters: caps what an imported file can make
 * the app store or render.
 */
export const maxLength =
  (max: number): Rule =>
  (value) =>
    typeof value === "string" && value.length <= max;

/**
 * A finite number between `min` and `max` (both inclusive, unless
 * `exclusiveMin`) — to reject physically impossible values.
 *
 * @example
 * inRange(0, 200, { exclusiveMin: true })(0); // => false
 */
export const inRange =
  (min: number, max: number, { exclusiveMin = false } = {}): Rule =>
  (value) =>
    isFiniteNumber(value) &&
    (exclusiveMin ? value > min : value >= min) &&
    value <= max;

/** One of the given strings (an enum column). */
export const oneOf =
  (...values: string[]): Rule =>
  (value) =>
    typeof value === "string" && values.includes(value);

/** `null`, or a value passing `rule`. */
export const nullable =
  (rule: Rule): Rule =>
  (value) =>
    value === null || rule(value);

/** The field must be present (not `undefined`) and pass `rule`. */
export const required = (rule: Rule): FieldSpec => ({ rule, required: true });

/** The field may be absent; when present, it must pass `rule`. */
export const optional = (rule: Rule): FieldSpec => ({ rule });

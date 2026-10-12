import type { RecordSpec } from "./rules.js";

export type RecordValidationReason =
  "not-a-list" | "not-an-object" | "missing" | "invalid" | "duplicate";

/**
 * Thrown on the first invalid record. `path` locates it (`"foods[2]"`), `field`
 * names the faulty field, and `reason` lets the app word its own message.
 */
export class RecordValidationError extends Error {
  constructor(
    readonly reason: RecordValidationReason,
    readonly path: string,
    readonly field?: string,
  ) {
    super(`${path}: ${field ? `"${field}" ` : ""}${reason}`);
    this.name = "RecordValidationError";
  }
}

export interface ValidateRecordsOptions {
  /** Name used in error paths. Default: `"records"`. */
  label?: string;
  /** Field that must be unique across records (typically `"id"`). */
  uniqueKey?: string;
}

/**
 * Checks every record of an untrusted list (an imported backup table) against
 * `spec`, all or nothing: the first anomaly throws a `RecordValidationError`.
 * Returns clean copies holding only the fields of the spec, so an unknown or
 * injected key never reaches the database.
 *
 * @param rows - The untrusted value, expected to be an array of objects.
 * @param spec - Field name → `required(rule)` / `optional(rule)`.
 * @param options - `label` for error paths, `uniqueKey` to reject duplicates.
 * @returns The validated records.
 * @example
 * validateRecords(data.ratios, {
 *   id: required(isPositiveInteger),
 *   label: required(maxLength(100)),
 *   gramsPerUnit: required(inRange(0, 200, { exclusiveMin: true })),
 * }, { label: "ratios", uniqueKey: "id" });
 */
export function validateRecords(
  rows: unknown,
  spec: RecordSpec,
  { label = "records", uniqueKey }: ValidateRecordsOptions = {},
): Record<string, unknown>[] {
  if (!Array.isArray(rows))
    throw new RecordValidationError("not-a-list", label);
  const seen = new Set<unknown>();
  return rows.map((row: unknown, index) => {
    const path = `${label}[${index}]`;
    if (typeof row !== "object" || row === null || Array.isArray(row)) {
      throw new RecordValidationError("not-an-object", path);
    }
    const clean: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(spec)) {
      const value = (row as Record<string, unknown>)[key];
      if (value === undefined) {
        if (field.required)
          throw new RecordValidationError("missing", path, key);
        continue;
      }
      if (!field.rule(value))
        throw new RecordValidationError("invalid", path, key);
      clean[key] = value;
    }
    if (uniqueKey !== undefined) {
      if (seen.has(clean[uniqueKey])) {
        throw new RecordValidationError("duplicate", path, uniqueKey);
      }
      seen.add(clean[uniqueKey]);
    }
    return clean;
  });
}

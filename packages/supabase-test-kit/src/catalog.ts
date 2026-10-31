/**
 * One element of the schema fingerprint (`sql/schema-catalog.sql`): a table
 * and its RLS flags, a column, a policy, a trigger, a function or a
 * constraint.
 */
export interface CatalogRow {
  /**
   * What the element is: `table`, `column`, `policy`, `trigger`, `function` or
   * `constraint`.
   */
  kind: string;
  /**
   * Name of the element, unique within its `kind`: `profiles` for a table,
   * `profiles.email` for a column, `profiles.<policy>` for a policy, `name(arg
   * types)` for a function.
   */
  name: string;
  /**
   * Comparable definition: column type and nullability, RLS flags, policy
   * command / roles / conditions, trigger definition, an md5 of a function body
   * with its security settings, constraint definition. Two schemas match when
   * every definition matches.
   */
  definition: string;
}

/**
 * Result of {@link diffCatalogs}: what differs between the expected and the
 * actual schema, keyed by `"<kind> <name>"`.
 */
export interface CatalogDiff {
  /** In the expected schema only: a migration not applied? */
  missing: string[];
  /** In the actual schema only: changed by hand? */
  extra: { key: string; definition: string }[];
  /** In both, with another definition. */
  changed: { key: string; expected: string; actual: string }[];
}

const key = (row: CatalogRow) => `${row.kind} ${row.name}`;

/**
 * Compares two schema fingerprints, e.g. the snapshot built from the
 * migrations and production.
 *
 * @param expected - The reference fingerprint.
 * @param actual - The fingerprint to check.
 * @returns The missing, extra and changed elements, keyed `"<kind> <name>"`.
 */
export function diffCatalogs(
  expected: CatalogRow[],
  actual: CatalogRow[],
): CatalogDiff {
  const expectedMap = new Map(expected.map((r) => [key(r), r.definition]));
  const actualMap = new Map(actual.map((r) => [key(r), r.definition]));
  const diff: CatalogDiff = { missing: [], extra: [], changed: [] };

  for (const [k, definition] of expectedMap) {
    const actualDefinition = actualMap.get(k);
    if (actualDefinition === undefined) diff.missing.push(k);
    else if (actualDefinition !== definition)
      diff.changed.push({
        key: k,
        expected: definition,
        actual: actualDefinition,
      });
  }
  for (const [k, definition] of actualMap) {
    if (!expectedMap.has(k)) diff.extra.push({ key: k, definition });
  }
  return diff;
}

/**
 * Serializes a fingerprint the way the snapshot file stores it.
 *
 * @param rows - The fingerprint.
 * @returns Indented JSON with a trailing newline.
 */
export function serializeCatalog(rows: CatalogRow[]): string {
  return `${JSON.stringify(rows, null, 2)}\n`;
}

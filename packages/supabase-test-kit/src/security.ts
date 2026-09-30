/**
 * Who may read a table:
 * - `public`: signed-out visitors may read some or all rows;
 * - `authenticated`: any signed-in user may read every row (`USING (true)`);
 * - `restricted`: limited reads (own rows, some roles, published rows…),
 *   never a read policy open to everyone.
 */
export type TableAccess = "public" | "authenticated" | "restricted";

export interface PolicyRow {
  table: string;
  name: string;
  /** `SELECT`, `INSERT`, `UPDATE`, `DELETE` or `ALL`. */
  cmd: string;
  roles: string[];
  qual: string | null;
  with_check: string | null;
}

export interface TableRow {
  name: string;
  rls: boolean;
}

export interface SecurityRulesOptions {
  /** Every table of the schema, classified: an unlisted table is reported. */
  tableAccess: Record<string, TableAccess>;
  /** Intended write policies open to everyone, as `"<table>.<policy name>"`. */
  openWritePolicies?: Iterable<string>;
  /**
   * SQL functions only true for a signed-in user, besides `auth.uid()` and
   * `auth.role()` — e.g. `["get_my_role"]`. A condition calling one of them
   * doesn't count as open to visitors.
   */
  authFunctions?: string[];
}

export interface SecurityViolations {
  tablesWithoutRls: string[];
  /** Tables missing from `tableAccess`. */
  unclassifiedTables: string[];
  /** `tableAccess` entries that match no table. */
  unknownTables: string[];
  /** `USING (true)` read policies on `restricted` tables. */
  openReadsOnRestrictedTables: string[];
  /** Read policies reaching visitors on non-`public` tables. */
  anonReadsOnPrivateTables: string[];
  /** Write policies open to everyone, not in `openWritePolicies`. */
  openWrites: string[];
  /** Write policies reaching visitors, not in `openWritePolicies`. */
  anonWrites: string[];
}

const DEFAULT_AUTH_FUNCTIONS = ["auth.uid", "auth.role"];

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

/**
 * Checks the RLS setup of a schema against a few invariants, from its tables
 * and policies (`pg_policies`). Heuristic on purpose: a condition is deemed
 * "signed in only" when it calls `auth.uid()`, `auth.role()` or one of
 * `authFunctions`.
 *
 * @param tables - The schema's tables and their RLS flag.
 * @param policies - The schema's policies.
 * @param options - The table classification and the intended exceptions.
 * @returns Every violation, as `"<table>.<policy name>"` or table names.
 */
export function findSecurityViolations(
  tables: TableRow[],
  policies: PolicyRow[],
  {
    tableAccess,
    openWritePolicies = [],
    authFunctions = [],
  }: SecurityRulesOptions,
): SecurityViolations {
  const allowedOpenWrites = new Set(openWritePolicies);
  const names = new Set(tables.map((t) => t.name));
  const loginPattern = new RegExp(
    [...DEFAULT_AUTH_FUNCTIONS, ...authFunctions]
      .map((fn) => `${escapeRegExp(fn)}\\(\\)`)
      .join("|"),
  );

  const label = (p: PolicyRow) => `${p.table}.${p.name}`;
  const needsLogin = (expr: string | null) => !!expr && loginPattern.test(expr);
  const reachesAnon = (p: PolicyRow) =>
    p.roles.includes("anon") || p.roles.includes("public");
  const reads = policies.filter((p) => ["SELECT", "ALL"].includes(p.cmd));
  const writes = policies.filter(
    (p) => p.cmd !== "SELECT" && !allowedOpenWrites.has(label(p)),
  );

  return {
    tablesWithoutRls: tables.filter((t) => !t.rls).map((t) => t.name),
    unclassifiedTables: [...names].filter((n) => !(n in tableAccess)),
    unknownTables: Object.keys(tableAccess).filter((n) => !names.has(n)),
    openReadsOnRestrictedTables: reads
      .filter((p) => p.qual === "true" && tableAccess[p.table] === "restricted")
      .map(label),
    anonReadsOnPrivateTables: reads
      .filter(
        (p) =>
          reachesAnon(p) &&
          !needsLogin(p.qual) &&
          tableAccess[p.table] !== "public",
      )
      .map(label),
    openWrites: writes
      .filter((p) => p.qual === "true" || p.with_check === "true")
      .map(label),
    anonWrites: writes
      .filter(
        (p) =>
          reachesAnon(p) && !needsLogin(p.qual) && !needsLogin(p.with_check),
      )
      .map(label),
  };
}

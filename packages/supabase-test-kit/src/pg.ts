import { readFileSync } from "node:fs";
import pg from "pg";

import type { CatalogRow } from "./catalog.js";
import { SCHEMA_CATALOG_SQL_PATH } from "./paths.js";
import type { PolicyRow, TableRow } from "./security.js";

export { SCHEMA_CATALOG_SQL_PATH };

// Functions created by an extension (pgcrypto…) aren't the project's code
const NOT_FROM_EXTENSION = `NOT EXISTS (
  SELECT 1 FROM pg_depend d WHERE d.objid = p.oid AND d.deptype = 'e')`;

/**
 * Runs one query on a direct Postgres connection (system catalogs,
 * `plpgsql_check`…), opening and closing the connection around it.
 *
 * @param dbUrl - The connection string (see `resolveLocalSupabaseEnv().dbUrl`).
 * @param sql - The query.
 * @returns The rows.
 */
export async function pgQuery<T>(dbUrl: string, sql: string): Promise<T[]> {
  const client = new pg.Client(dbUrl);
  await client.connect();
  try {
    return (await client.query(sql)).rows as T[];
  } finally {
    await client.end();
  }
}

/** The schema fingerprint (`sql/schema-catalog.sql`), sorted. */
export function readSchemaCatalog(dbUrl: string): Promise<CatalogRow[]> {
  return pgQuery(dbUrl, readFileSync(SCHEMA_CATALOG_SQL_PATH, "utf8"));
}

/** The tables of the public schema and their RLS flag. */
export function readTables(dbUrl: string): Promise<TableRow[]> {
  return pgQuery(
    dbUrl,
    `SELECT c.relname AS name, c.relrowsecurity AS rls
     FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')`,
  );
}

/** The policies of the public schema. */
export function readPolicies(dbUrl: string): Promise<PolicyRow[]> {
  return pgQuery(
    dbUrl,
    `SELECT tablename AS table, policyname AS name, cmd, roles::text[] AS roles, qual, with_check
     FROM pg_policies WHERE schemaname = 'public'`,
  );
}

/**
 * `SECURITY DEFINER` functions of the public schema without a fixed
 * `search_path`: a caller could shadow the objects they use.
 *
 * @returns Their names.
 */
export async function findUnsafeSecurityDefiners(
  dbUrl: string,
): Promise<string[]> {
  const rows = await pgQuery<{ name: string }>(
    dbUrl,
    `SELECT p.proname AS name
     FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
     WHERE n.nspname = 'public' AND p.prosecdef AND ${NOT_FROM_EXTENSION}
       AND NOT coalesce(array_to_string(p.proconfig, ',') LIKE '%search_path=%', false)`,
  );
  return rows.map((r) => r.name);
}

/**
 * Checks the PL/pgSQL functions of the public schema with `plpgsql_check`
 * (installed on the way): unknown columns or tables, type errors… which
 * Postgres would otherwise only report when the code runs. Trigger functions
 * are checked against each table they're attached to.
 *
 * @returns The errors, as `"<function> (<table>): <message>"`.
 */
export async function findPlpgsqlErrors(dbUrl: string): Promise<string[]> {
  await pgQuery(dbUrl, "CREATE EXTENSION IF NOT EXISTS plpgsql_check");
  const rows = await pgQuery<{ fn: string; message: string }>(
    dbUrl,
    `WITH fns AS (
       SELECT p.oid, p.proname, p.prorettype = 'trigger'::regtype AS is_trigger
       FROM pg_proc p
       JOIN pg_namespace n ON n.oid = p.pronamespace
       JOIN pg_language l ON l.oid = p.prolang
       WHERE n.nspname = 'public' AND l.lanname = 'plpgsql' AND ${NOT_FROM_EXTENSION}
     ),
     targets AS (
       SELECT f.oid, f.proname, t.tgrelid AS relid
       FROM fns f JOIN pg_trigger t ON t.tgfoid = f.oid AND NOT t.tgisinternal
       UNION
       SELECT f.oid, f.proname, 0 FROM fns f WHERE NOT f.is_trigger
     )
     SELECT t.proname || coalesce(' (' || nullif(t.relid, 0)::regclass::text || ')', '') AS fn,
            r.message
     FROM targets t
     CROSS JOIN LATERAL plpgsql_check_function_tb(t.oid, t.relid) r
     WHERE r.level = 'error'`,
  );
  return rows.map((r) => `${r.fn}: ${r.message}`);
}

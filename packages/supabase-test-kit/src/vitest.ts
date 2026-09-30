import { beforeAll, describe, expect, it } from "vitest";

import { serializeCatalog } from "./catalog.js";
import {
  findPlpgsqlErrors,
  findUnsafeSecurityDefiners,
  readPolicies,
  readSchemaCatalog,
  readTables,
} from "./pg.js";
import type { SecurityRulesOptions, SecurityViolations } from "./security.js";
import { findSecurityViolations } from "./security.js";

export interface SchemaSecurityTestsOptions extends SecurityRulesOptions {
  /** Direct Postgres connection string (see `resolveLocalSupabaseEnv`). */
  dbUrl: string;
  /**
   * Snapshot of the schema fingerprint, relative to the test file (defaults to
   * `./__snapshots__/schema-catalog.json`), also read by `supabase-db-drift`.
   * `false` skips it.
   */
  snapshot?: string | false;
  /** Checks PL/pgSQL functions with `plpgsql_check` (default `true`). */
  plpgsqlCheck?: boolean;
}

/**
 * Registers the schema security suite, to call at the top level of a test
 * file running against a database built by the migrations: the fingerprint
 * snapshot, RLS on every table, every table classified, no unintended read or
 * write open to everyone or to visitors, a fixed `search_path` on
 * `SECURITY DEFINER` functions, and `plpgsql_check`.
 *
 * @param options - The connection, the table classification and exceptions.
 * @example
 * // tests/db/security-rules.test.ts
 * defineSchemaSecurityTests({
 *   dbUrl: resolveLocalSupabaseEnv().dbUrl,
 *   tableAccess: { posts: "public", comments: "authenticated", profiles: "restricted" },
 *   openWritePolicies: ["contact_messages.Anyone can insert contact messages"],
 * });
 */
export function defineSchemaSecurityTests({
  dbUrl,
  snapshot = "./__snapshots__/schema-catalog.json",
  plpgsqlCheck = true,
  ...rules
}: SchemaSecurityTestsOptions): void {
  describe("schema security", () => {
    let violations: SecurityViolations;

    beforeAll(async () => {
      const [tables, policies] = await Promise.all([
        readTables(dbUrl),
        readPolicies(dbUrl),
      ]);
      violations = findSecurityViolations(tables, policies, rules);
    });

    if (snapshot) {
      it("matches the snapshot built from the migrations (`-u` after an intended change)", async () => {
        const catalog = await readSchemaCatalog(dbUrl);
        await expect(serializeCatalog(catalog)).toMatchFileSnapshot(snapshot);
      });
    }

    it("has RLS enabled on every table", () => {
      expect(violations.tablesWithoutRls).toEqual([]);
    });

    it("classifies every table in tableAccess", () => {
      expect(violations.unclassifiedTables).toEqual([]);
      expect(violations.unknownTables).toEqual([]);
    });

    it("opens no read to everyone on a restricted table", () => {
      expect(violations.openReadsOnRestrictedTables).toEqual([]);
    });

    it("lets visitors read public tables only", () => {
      expect(violations.anonReadsOnPrivateTables).toEqual([]);
    });

    it("opens no write to everyone, except intended ones", () => {
      expect(violations.openWrites).toEqual([]);
    });

    it("lets visitors write nowhere, except intended ones", () => {
      expect(violations.anonWrites).toEqual([]);
    });

    it("fixes the search_path of SECURITY DEFINER functions", async () => {
      expect(await findUnsafeSecurityDefiners(dbUrl)).toEqual([]);
    });

    if (plpgsqlCheck) {
      it("only references existing objects in PL/pgSQL code (plpgsql_check)", async () => {
        expect(await findPlpgsqlErrors(dbUrl)).toEqual([]);
      });
    }
  });
}

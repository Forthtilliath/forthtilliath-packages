import { parseArgs } from "node:util";

import type { CatalogRow } from "./catalog.js";
import { diffCatalogs } from "./catalog.js";
import type { CliIo } from "./cliIo.js";
import { failureCode, supabaseCli } from "./cliIo.js";
import { SCHEMA_CATALOG_SQL_PATH } from "./paths.js";

/**
 * Where `supabase-db-drift` reads the fingerprint snapshot by default, relative
 * to the project root (the file `defineSchemaSecurityTests` writes).
 * @internal
 */
export const DEFAULT_SNAPSHOT = "tests/db/__snapshots__/schema-catalog.json";

const USAGE = `Usage: supabase-db-drift (--project-ref <ref> | --local) [--snapshot <path>] [--catalog <sql>]

Compares a database schema with the snapshot built from the migrations
(default snapshot: ${DEFAULT_SNAPSHOT}). Read-only; exits with 1 on drift.
Needs the Supabase CLI 3.x or newer.`;

// Supabase project refs are lowercase letters and digits; anything else would
// end up unquoted in the shell command.
const PROJECT_REF_PATTERN = /^[a-z0-9]+$/;

/**
 * Reads the result of `supabase db query --output-format json`, in either of
 * the CLI's formats: a plain array of rows, or `{ boundary, rows, warning }`
 * (the "untrusted data" envelope it uses when run by an AI agent). Notices
 * printed first on stdout are skipped: the result comes last, its opening
 * bracket at the start of a line (nested values are indented, and JSON
 * strings can't hold a raw line break).
 *
 * @param stdout - The CLI output.
 * @returns The query rows, or `null` if no result can be read.
 * @internal
 */
export function parseQueryOutput(
  stdout: string,
): { rows: CatalogRow[] } | null {
  const start = Math.max(
    ...[...stdout.matchAll(/^[[{]/gm)].map((match) => match.index),
  );
  if (!Number.isFinite(start)) return null;
  let output: unknown;
  try {
    output = JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
  const rows = Array.isArray(output)
    ? output
    : (output as { rows?: unknown } | null)?.rows;
  return Array.isArray(rows) ? { rows: rows as CatalogRow[] } : null;
}

/**
 * Reads why the Supabase CLI failed. With `--output-format json`, it prints its
 * error on stdout as `{ "_tag": "Error", "error": { message, suggestion } }`
 * (nothing on stderr), which would otherwise never reach the logs.
 *
 * @param stdout - The CLI output.
 * @returns The error message (and its suggestion on a second line), else the
 *   last lines of the output; `""` if it printed nothing.
 * @internal
 */
export function describeCliError(stdout: string): string {
  const start = Math.max(
    ...[...stdout.matchAll(/^\{/gm)].map((match) => match.index),
  );
  if (Number.isFinite(start)) {
    try {
      const output = JSON.parse(stdout.slice(start)) as {
        _tag?: unknown;
        error?: { message?: unknown; suggestion?: unknown };
      } | null;
      const message = output?.error?.message;
      if (output?._tag === "Error" && typeof message === "string") {
        const suggestion = output.error?.suggestion;
        return typeof suggestion === "string"
          ? `${message}\n${suggestion}`
          : message;
      }
    } catch {
      // Not the JSON envelope: fall back to the raw output below.
    }
  }
  return stdout
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .slice(-5)
    .join("\n");
}

function printSection(io: CliIo, title: string, lines: string[]): void {
  if (lines.length === 0) return;
  io.log(`\n${title} (${lines.length})`);
  for (const line of lines) io.log(line);
}

/**
 * `supabase-db-drift`: reads the schema fingerprint of production (through
 * the Supabase CLI 3+, signed in or with `SUPABASE_ACCESS_TOKEN`) or of the local
 * database, and compares it with the snapshot: migrations not applied,
 * changes made by hand in the dashboard…
 *
 * @param argv - The command line arguments.
 * @param io - Process, file system and console access.
 * @returns The exit code: 0 without drift, 1 on drift or failure, 2 on usage
 *   error.
 * @internal
 */
export function runDrift(argv: string[], io: CliIo): number {
  let values;
  try {
    ({ values } = parseArgs({
      args: argv,
      options: {
        local: { type: "boolean", default: false },
        "project-ref": { type: "string" },
        snapshot: { type: "string", default: DEFAULT_SNAPSHOT },
        catalog: { type: "string", default: SCHEMA_CATALOG_SQL_PATH },
      },
    }));
  } catch (error) {
    io.error(`${(error as Error).message}\n\n${USAGE}`);
    return 2;
  }
  const projectRef = values["project-ref"];
  if (!values.local && !projectRef) {
    io.error(USAGE);
    return 2;
  }
  if (projectRef && !PROJECT_REF_PATTERN.test(projectRef)) {
    io.error(`Invalid project ref "${projectRef}".\n\n${USAGE}`);
    return 2;
  }

  const target = values.local ? "local" : `project ${projectRef}`;
  // CLI 3: the local database is the default target (`--local` is
  // deprecated), and `--read-only` runs the query in a read-only transaction,
  // through the Management API for a hosted project: a token scoped to the
  // project with Database: Read is enough, and no confirmation is asked.
  const source = values.local ? "" : `--remote=${projectRef} `;
  const result = io.run(
    `${supabaseCli(io)} db query ${source}--read-only -f "${values.catalog}" --output-format json`,
  );
  if (result.status !== 0) {
    io.error(`Could not read the schema (${target}).`);
    const detail = describeCliError(result.stdout);
    if (detail) io.error(detail);
    return failureCode(result);
  }

  const output = parseQueryOutput(result.stdout);
  if (!output) {
    io.error(`Unexpected output from the Supabase CLI (${target}).`);
    return 1;
  }
  const expected = JSON.parse(io.readFile(values.snapshot)) as CatalogRow[];
  const { missing, extra, changed } = diffCatalogs(expected, output.rows);

  printSection(
    io,
    "Missing from the database — migration not applied?",
    missing.map((key) => `  - ${key}`),
  );
  printSection(
    io,
    "Only in the database — changed by hand?",
    extra.map((e) => `  + ${e.key}\n      ${e.definition}`),
  );
  printSection(
    io,
    "Different from the migrations",
    changed.map(
      (c) =>
        `  ~ ${c.key}\n      expected: ${c.expected}\n      database: ${c.actual}`,
    ),
  );

  const total = missing.length + extra.length + changed.length;
  if (total > 0) {
    io.log(
      `\n${total} difference(s) between the database (${target}) and the migrations.`,
    );
    return 1;
  }
  io.log(
    `No drift: the database (${target}) matches the migrations (${expected.length} elements).`,
  );
  return 0;
}

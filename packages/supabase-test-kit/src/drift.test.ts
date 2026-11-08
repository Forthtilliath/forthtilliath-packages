import { describe, expect, it } from "vitest";

import {
  DEFAULT_SNAPSHOT,
  describeCliError,
  parseQueryOutput,
  runDrift,
} from "./drift.js";
import { SCHEMA_CATALOG_SQL_PATH } from "./paths.js";
import { createTestIo } from "./testIo.js";

const snapshot = JSON.stringify([
  { kind: "table", name: "news", definition: "rls=true force=false" },
  { kind: "policy", name: "news.Members read", definition: "SELECT …" },
]);

// The CLI may print a notice before the JSON
const cliOutput = (rows: unknown[]) => ({
  status: 0,
  stdout: `Connecting to remote database...\n${JSON.stringify({ rows })}`,
});

describe("runDrift", () => {
  it("reports no drift when production matches the snapshot", () => {
    const { io, out } = createTestIo(
      cliOutput(JSON.parse(snapshot) as unknown[]),
      {
        [DEFAULT_SNAPSHOT]: snapshot,
      },
    );

    expect(runDrift(["--project-ref", "abcdef"], io)).toBe(0);
    expect(io.run).toHaveBeenCalledWith(
      `npx supabase db query --remote=abcdef --read-only -f "${SCHEMA_CATALOG_SQL_PATH}" --output-format json`,
    );
    expect(out).toEqual([
      "No drift: the database (project abcdef) matches the migrations (2 elements).",
    ]);
  });

  it("reads the plain array of rows the CLI prints in a terminal", () => {
    const { io, out } = createTestIo(
      {
        status: 0,
        stdout: JSON.stringify(JSON.parse(snapshot), null, 2),
      },
      { [DEFAULT_SNAPSHOT]: snapshot },
    );

    expect(runDrift(["--project-ref", "abcdef"], io)).toBe(0);
    expect(out[0]).toMatch(/^No drift/);
  });

  it("lists missing, extra and changed elements", () => {
    const { io, out } = createTestIo(
      cliOutput([
        { kind: "table", name: "news", definition: "rls=false force=false" },
        {
          kind: "policy",
          name: "news.Anyone reads",
          definition: "SELECT … (true)",
        },
      ]),
      { "db/snapshot.json": snapshot },
    );

    expect(runDrift(["--local", "--snapshot", "db/snapshot.json"], io)).toBe(1);
    expect(io.run).toHaveBeenCalledWith(
      expect.stringContaining("db query --read-only -f"),
    );
    expect(out.join("\n")).toBe(
      [
        "",
        "Missing from the database — migration not applied? (1)",
        "  - policy news.Members read",
        "",
        "Only in the database — changed by hand? (1)",
        "  + policy news.Anyone reads\n      SELECT … (true)",
        "",
        "Different from the migrations (1)",
        "  ~ table news\n      expected: rls=true force=false\n      database: rls=false force=false",
        "",
        "3 difference(s) between the database (local) and the migrations.",
      ].join("\n"),
    );
  });

  it("uses SUPABASE_CLI and a custom catalog query", () => {
    const { io } = createTestIo(cliOutput([]), { [DEFAULT_SNAPSHOT]: "[]" });
    io.env = { SUPABASE_CLI: "supabase" };

    expect(runDrift(["--local", "--catalog", "checks/catalog.sql"], io)).toBe(
      0,
    );
    expect(io.run).toHaveBeenCalledWith(
      'supabase db query --read-only -f "checks/catalog.sql" --output-format json',
    );
  });

  it("fails when the CLI output holds no query result", () => {
    const { io, err } = createTestIo(
      { status: 0, stdout: "Initialising login role...\n" },
      { [DEFAULT_SNAPSHOT]: snapshot },
    );
    expect(runDrift(["--project-ref", "abcdef"], io)).toBe(1);
    expect(err).toEqual([
      "Unexpected output from the Supabase CLI (project abcdef).",
    ]);
  });

  it("fails when the schema can't be read", () => {
    const { io, err } = createTestIo({ status: 3, stdout: "" });
    expect(runDrift(["--project-ref", "abcdef"], io)).toBe(3);
    expect(err).toEqual(["Could not read the schema (project abcdef)."]);
  });

  it("prints the error the CLI wrote as JSON on stdout", () => {
    const { io, err } = createTestIo({
      status: 1,
      stdout: JSON.stringify({
        target: { kind: "linked", project_ref: "abcdef" },
        _tag: "Error",
        error: {
          code: "DbQueryUnexpectedStatusError",
          message: "unexpected status 401: Invalid access token",
          suggestion: "Check SUPABASE_ACCESS_TOKEN",
        },
      }),
    });
    expect(runDrift(["--project-ref", "abcdef"], io)).toBe(1);
    expect(err).toEqual([
      "Could not read the schema (project abcdef).",
      "unexpected status 401: Invalid access token\nCheck SUPABASE_ACCESS_TOKEN",
    ]);
  });

  it("rejects a project ref that is not letters and digits", () => {
    const { io, err } = createTestIo(cliOutput([]));
    expect(runDrift(["--project-ref", "abc; rm -rf ~"], io)).toBe(2);
    expect(err[0]).toMatch(/^Invalid project ref/);
    expect(io.run).not.toHaveBeenCalled();
  });

  it("fails with 1 when the CLI dies without a status", () => {
    const { io } = createTestIo({ status: null, stdout: "" });
    expect(runDrift(["--local"], io)).toBe(1);
  });

  it("requires a project ref or --local", () => {
    const { io, err } = createTestIo(cliOutput([]));
    expect(runDrift([], io)).toBe(2);
    expect(err[0]).toMatch(/^Usage: supabase-db-drift/);
    expect(io.run).not.toHaveBeenCalled();
  });

  it("rejects unknown options", () => {
    const { io, err } = createTestIo(cliOutput([]));
    expect(runDrift(["--prod"], io)).toBe(2);
    expect(err[0]).toMatch(/--prod[\s\S]*Usage: supabase-db-drift/);
  });
});

describe("parseQueryOutput", () => {
  const rows = [{ kind: "table", name: "news", definition: "rls=true" }];
  // The CLI's two formats, pretty-printed like the CLI does
  const formats = [
    ["a plain array of rows", JSON.stringify(rows, null, 2)],
    [
      "the untrusted-data envelope (AI agents)",
      JSON.stringify({ boundary: "b1", rows, warning: "untrusted" }, null, 2),
    ],
  ];

  it.each(formats)("reads %s", (_, result) => {
    expect(parseQueryOutput(result)).toEqual({ rows });
  });

  it.each(formats)("skips notices printed before %s", (_, result) => {
    expect(parseQueryOutput(`Initialising login role...\n${result}\n`)).toEqual(
      { rows },
    );
  });

  it.each([
    ["no JSON", "Initialising login role...\n"],
    ["invalid JSON", "{ rows: [ }"],
    ["a JSON object without rows", '{\n  "error": "denied"\n}'],
    ["JSON null", "null"],
  ])("returns null for %s", (_, stdout) => {
    expect(parseQueryOutput(stdout)).toBeNull();
  });
});

describe("describeCliError", () => {
  it("reads the message of the JSON error envelope, after notices", () => {
    const envelope = JSON.stringify({
      _tag: "Error",
      error: { code: "X", message: "denied" },
    });
    expect(describeCliError(`Target: project abc\n${envelope}\n`)).toBe(
      "denied",
    );
  });

  it("falls back to the last lines of a non-JSON output", () => {
    const stdout = ["a", "b", "", "c", "d", "e", "f"].join("\n");
    expect(describeCliError(stdout)).toBe("b\nc\nd\ne\nf");
  });

  it("falls back to the raw output for JSON that is not an error", () => {
    expect(describeCliError('{"rows": []}')).toBe('{"rows": []}');
  });

  it("returns an empty string for an empty output", () => {
    expect(describeCliError("")).toBe("");
  });
});

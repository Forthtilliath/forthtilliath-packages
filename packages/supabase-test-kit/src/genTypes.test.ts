import { describe, expect, it } from "vitest";

import { DEFAULT_TYPES_OUTPUT, runGenTypes } from "./genTypes.js";
import { createTestIo } from "./testIo.js";

const TYPES = "export type Json = string\nexport type Database = {}\n";

describe("runGenTypes", () => {
  it("writes the types through a temporary file", () => {
    const { io, out } = createTestIo({ status: 0, stdout: TYPES });

    expect(runGenTypes(["--project-id", "abcdef"], io)).toBe(0);
    expect(io.run).toHaveBeenCalledWith(
      "npx supabase gen types typescript --project-id abcdef --schema public",
      { input: "y\n" },
    );
    expect(io.writeFile).toHaveBeenCalledWith(
      `${DEFAULT_TYPES_OUTPUT}.tmp`,
      TYPES,
    );
    expect(io.rename).toHaveBeenCalledWith(
      `${DEFAULT_TYPES_OUTPUT}.tmp`,
      DEFAULT_TYPES_OUTPUT,
    );
    expect(out).toEqual([
      `${DEFAULT_TYPES_OUTPUT} regenerated (--project-id abcdef).`,
    ]);
  });

  it("supports --local, --output, --schema and SUPABASE_CLI", () => {
    const { io } = createTestIo({ status: 0, stdout: TYPES });
    io.env = { SUPABASE_CLI: "supabase" };

    expect(
      runGenTypes(
        ["--local", "--output", "types/db.ts", "--schema", "public,auth"],
        io,
      ),
    ).toBe(0);
    expect(io.run).toHaveBeenCalledWith(
      "supabase gen types typescript --local --schema public,auth",
      { input: "y\n" },
    );
    expect(io.rename).toHaveBeenCalledWith("types/db.ts.tmp", "types/db.ts");
  });

  it("leaves the file untouched when the command fails", () => {
    const { io, err } = createTestIo({ status: 1, stdout: "" });

    expect(runGenTypes(["--project-id", "abcdef"], io)).toBe(1);
    expect(io.writeFile).not.toHaveBeenCalled();
    expect(err[0]).toContain(`${DEFAULT_TYPES_OUTPUT} was left untouched`);
    expect(err[1]).toMatch(/^Access denied\?/);
  });

  it("leaves the file untouched when the output isn't types", () => {
    const { io, err } = createTestIo({
      status: 0,
      stdout: "Need to install supabase",
    });

    expect(runGenTypes(["--local"], io)).toBe(1);
    expect(io.writeFile).not.toHaveBeenCalled();
    // No account hint for the local database
    expect(err).toHaveLength(1);
  });

  it("requires a project id or --local", () => {
    const { io, err } = createTestIo({ status: 0, stdout: TYPES });
    expect(runGenTypes([], io)).toBe(2);
    expect(err[0]).toMatch(/^Usage: supabase-gen-types/);
  });

  it("rejects unknown options", () => {
    const { io, err } = createTestIo({ status: 0, stdout: TYPES });
    expect(runGenTypes(["--project", "abcdef"], io)).toBe(2);
    expect(err[0]).toMatch(/--project[\s\S]*Usage: supabase-gen-types/);
  });
});

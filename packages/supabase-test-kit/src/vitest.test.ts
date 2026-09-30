import { describe, vi } from "vitest";

import { defineSchemaSecurityTests } from "./vitest.js";

const DB = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

// A sound schema: the suites registered below must pass against it. Each
// reader only answers for the expected database.
vi.mock("./pg.js", () => {
  const DB = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
  const answer =
    <T>(value: T) =>
    (dbUrl: string) =>
      dbUrl === DB
        ? Promise.resolve(value)
        : Promise.reject(new Error(`Unexpected database: ${dbUrl}`));
  return {
    readTables: answer([
      { name: "posts", rls: true },
      { name: "profiles", rls: true },
    ]),
    readPolicies: answer([
      {
        table: "posts",
        name: "Anyone reads",
        cmd: "SELECT",
        roles: ["anon", "authenticated"],
        qual: "true",
        with_check: null,
      },
      {
        table: "profiles",
        name: "Own profile",
        cmd: "ALL",
        roles: ["authenticated"],
        qual: "(id = auth.uid())",
        with_check: "(id = auth.uid())",
      },
    ]),
    readSchemaCatalog: answer([
      { kind: "table", name: "posts", definition: "rls=true force=false" },
      { kind: "table", name: "profiles", definition: "rls=true force=false" },
    ]),
    findUnsafeSecurityDefiners: answer([]),
    findPlpgsqlErrors: answer([]),
  };
});

defineSchemaSecurityTests({
  dbUrl: DB,
  snapshot: "./__fixtures__/schema-catalog.json",
  tableAccess: { posts: "public", profiles: "restricted" },
});

// Without snapshot nor plpgsql_check: their tests aren't registered
describe("options", () => {
  defineSchemaSecurityTests({
    dbUrl: DB,
    snapshot: false,
    plpgsqlCheck: false,
    tableAccess: { posts: "public", profiles: "restricted" },
  });
});

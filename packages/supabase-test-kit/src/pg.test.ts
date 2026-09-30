import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  findPlpgsqlErrors,
  findUnsafeSecurityDefiners,
  pgQuery,
  readPolicies,
  readSchemaCatalog,
  readTables,
  SCHEMA_CATALOG_SQL_PATH,
} from "./pg.js";

const client = vi.hoisted(() => ({
  connect: vi.fn(),
  query: vi.fn(),
  end: vi.fn(),
}));

vi.mock("pg", () => ({
  default: {
    // A `function`, not an arrow: `pg.Client` is called with `new`
    Client: vi.fn(function () {
      return client;
    }),
  },
}));

const DB = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

beforeEach(() => {
  vi.clearAllMocks();
  client.query.mockResolvedValue({ rows: [] });
});

describe("pgQuery", () => {
  it("runs the query on a fresh connection and closes it", async () => {
    client.query.mockResolvedValue({ rows: [{ one: 1 }] });
    await expect(pgQuery(DB, "SELECT 1 AS one")).resolves.toEqual([{ one: 1 }]);
    expect(client.connect).toHaveBeenCalledOnce();
    expect(client.query).toHaveBeenCalledWith("SELECT 1 AS one");
    expect(client.end).toHaveBeenCalledOnce();
  });

  it("closes the connection when the query fails", async () => {
    client.query.mockRejectedValue(new Error("syntax error"));
    await expect(pgQuery(DB, "SELEC")).rejects.toThrow("syntax error");
    expect(client.end).toHaveBeenCalledOnce();
  });
});

describe("readers", () => {
  it("reads the fingerprint with the shipped query", async () => {
    const rows = [
      { kind: "table", name: "news", definition: "rls=true force=false" },
    ];
    client.query.mockResolvedValue({ rows });
    await expect(readSchemaCatalog(DB)).resolves.toEqual(rows);
    expect(client.query).toHaveBeenCalledWith(
      readFileSync(SCHEMA_CATALOG_SQL_PATH, "utf8"),
    );
  });

  it("reads tables and policies of the public schema", async () => {
    await readTables(DB);
    await readPolicies(DB);
    expect(client.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("relrowsecurity"),
    );
    expect(client.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("pg_policies"),
    );
  });

  it("lists SECURITY DEFINER functions without search_path", async () => {
    client.query.mockResolvedValue({ rows: [{ name: "get_my_role" }] });
    await expect(findUnsafeSecurityDefiners(DB)).resolves.toEqual([
      "get_my_role",
    ]);
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("prosecdef"),
    );
  });

  it("installs plpgsql_check and formats its errors", async () => {
    client.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({
      rows: [
        {
          fn: "on_member_update (members)",
          message: 'record "new" has no field "activated"',
        },
      ],
    });
    await expect(findPlpgsqlErrors(DB)).resolves.toEqual([
      'on_member_update (members): record "new" has no field "activated"',
    ]);
    expect(client.query).toHaveBeenNthCalledWith(
      1,
      "CREATE EXTENSION IF NOT EXISTS plpgsql_check",
    );
  });
});

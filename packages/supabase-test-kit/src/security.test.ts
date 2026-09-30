import { describe, expect, it } from "vitest";

import type { PolicyRow, SecurityRulesOptions } from "./security.js";
import { findSecurityViolations } from "./security.js";

const policy = (overrides: Partial<PolicyRow>): PolicyRow => ({
  table: "news",
  name: "policy",
  cmd: "SELECT",
  roles: ["authenticated"],
  qual: null,
  with_check: null,
  ...overrides,
});

const tables = [
  { name: "news", rls: true },
  { name: "songs", rls: true },
  { name: "members", rls: true },
];

const options: SecurityRulesOptions = {
  tableAccess: {
    news: "public",
    songs: "authenticated",
    members: "restricted",
  },
};

const violations = (
  policies: PolicyRow[],
  extra?: Partial<SecurityRulesOptions>,
) => findSecurityViolations(tables, policies, { ...options, ...extra });

describe("findSecurityViolations", () => {
  it("finds nothing on a sound schema", () => {
    expect(
      violations([
        policy({ table: "news", roles: ["anon"], qual: "published" }),
        policy({ table: "songs", qual: "true" }),
        policy({ table: "members", qual: "(id = auth.uid())" }),
        policy({
          table: "members",
          cmd: "UPDATE",
          roles: ["public"],
          qual: "(id = auth.uid())",
          with_check: "(id = auth.uid())",
        }),
      ]),
    ).toEqual({
      tablesWithoutRls: [],
      unclassifiedTables: [],
      unknownTables: [],
      openReadsOnRestrictedTables: [],
      anonReadsOnPrivateTables: [],
      openWrites: [],
      anonWrites: [],
    });
  });

  it("reports tables without RLS", () => {
    const result = findSecurityViolations(
      [...tables, { name: "logs", rls: false }],
      [],
      { tableAccess: { ...options.tableAccess, logs: "restricted" } },
    );
    expect(result.tablesWithoutRls).toEqual(["logs"]);
  });

  it("reports unclassified tables and unknown classifications", () => {
    const result = findSecurityViolations(
      [...tables, { name: "logs", rls: true }],
      [],
      {
        tableAccess: { ...options.tableAccess, old_table: "public" },
      },
    );
    expect(result.unclassifiedTables).toEqual(["logs"]);
    expect(result.unknownTables).toEqual(["old_table"]);
  });

  it("reports reads open to everyone on restricted tables", () => {
    const result = violations([
      policy({ table: "members", name: "Everyone reads", qual: "true" }),
      policy({ table: "members", name: "All", cmd: "ALL", qual: "true" }),
      policy({ table: "songs", name: "Members read", qual: "true" }),
    ]);
    expect(result.openReadsOnRestrictedTables).toEqual([
      "members.Everyone reads",
      "members.All",
    ]);
  });

  it("reports visitor reads on non-public tables", () => {
    const result = violations([
      policy({ table: "songs", name: "Anon", roles: ["anon"], qual: "true" }),
      policy({
        table: "songs",
        name: "Public",
        roles: ["public"],
        qual: "true",
      }),
      policy({
        table: "songs",
        name: "Logged",
        roles: ["public"],
        qual: "(auth.role() = 'authenticated')",
      }),
      policy({
        table: "news",
        name: "Visitors",
        roles: ["anon"],
        qual: "true",
      }),
    ]);
    expect(result.anonReadsOnPrivateTables).toEqual([
      "songs.Anon",
      "songs.Public",
    ]);
  });

  it("accepts extra login functions", () => {
    const readByRole = policy({
      table: "songs",
      name: "By role",
      roles: ["public"],
      qual: "(get_my_role() = 'admin'::text)",
    });
    expect(violations([readByRole]).anonReadsOnPrivateTables).toEqual([
      "songs.By role",
    ]);
    expect(
      violations([readByRole], { authFunctions: ["get_my_role"] })
        .anonReadsOnPrivateTables,
    ).toEqual([]);
  });

  it("reports writes open to everyone, except intended ones", () => {
    const result = violations(
      [
        policy({
          table: "songs",
          name: "Insert",
          cmd: "INSERT",
          with_check: "true",
        }),
        policy({ table: "songs", name: "Delete", cmd: "DELETE", qual: "true" }),
        policy({
          table: "news",
          name: "Contact",
          cmd: "INSERT",
          roles: ["anon"],
          with_check: "true",
        }),
      ],
      { openWritePolicies: ["news.Contact"] },
    );
    expect(result.openWrites).toEqual(["songs.Insert", "songs.Delete"]);
    expect(result.anonWrites).toEqual([]);
  });

  it("reports visitor writes, except intended ones", () => {
    const result = violations(
      [
        policy({
          table: "songs",
          name: "Anon insert",
          cmd: "INSERT",
          roles: ["anon"],
          with_check: "(title <> '')",
        }),
        policy({
          table: "songs",
          name: "Own update",
          cmd: "UPDATE",
          roles: ["public"],
          qual: "(owner = auth.uid())",
          with_check: "(title <> '')",
        }),
        policy({
          table: "news",
          name: "Contact",
          cmd: "INSERT",
          roles: ["anon"],
          with_check: "(body <> '')",
        }),
      ],
      { openWritePolicies: new Set(["news.Contact"]) },
    );
    // A login condition in USING or WITH CHECK is enough to shut visitors out
    expect(result.anonWrites).toEqual(["songs.Anon insert"]);
  });
});

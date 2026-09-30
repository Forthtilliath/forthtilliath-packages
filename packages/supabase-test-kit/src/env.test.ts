import { spawnSync } from "node:child_process";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LocalSupabaseEnv } from "./env.js";
import { readLocalSupabaseStatus, resolveLocalSupabaseEnv } from "./env.js";

vi.mock("node:child_process", () => ({ spawnSync: vi.fn() }));

const LOCAL: LocalSupabaseEnv = {
  url: "http://127.0.0.1:54321",
  dbUrl: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  anonKey: "sb_publishable_local",
  serviceRoleKey: "sb_local_service_role",
};

const VARIABLES = {
  SUPABASE_TEST_URL: "http://localhost:64321",
  SUPABASE_TEST_DB_URL: "postgresql://postgres:pw@localhost:64322/db",
  SUPABASE_TEST_ANON_KEY: "anon",
  SUPABASE_TEST_SERVICE_ROLE_KEY: "service",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("resolveLocalSupabaseEnv", () => {
  it("reads the SUPABASE_TEST_* variables", () => {
    const readStatus = vi.fn(() => LOCAL);
    expect(resolveLocalSupabaseEnv({ ...VARIABLES }, readStatus)).toEqual({
      url: "http://localhost:64321",
      dbUrl: "postgresql://postgres:pw@localhost:64322/db",
      anonKey: "anon",
      serviceRoleKey: "service",
    });
    expect(readStatus).not.toHaveBeenCalled();
  });

  it("fills the missing values from `supabase status` and caches them", () => {
    const env: Record<string, string | undefined> = {
      SUPABASE_TEST_ANON_KEY: "anon",
    };
    const readStatus = vi.fn(() => LOCAL);

    expect(resolveLocalSupabaseEnv(env, readStatus)).toEqual({
      ...LOCAL,
      anonKey: "anon",
    });
    expect(env).toEqual({
      SUPABASE_TEST_URL: LOCAL.url,
      SUPABASE_TEST_DB_URL: LOCAL.dbUrl,
      SUPABASE_TEST_ANON_KEY: "anon",
      SUPABASE_TEST_SERVICE_ROLE_KEY: LOCAL.serviceRoleKey,
    });

    resolveLocalSupabaseEnv(env, readStatus);
    expect(readStatus).toHaveBeenCalledOnce();
  });

  it.each([
    "https://abcdefgh.supabase.co",
    "http://127.0.0.1.example.com:54321",
    "http://10.0.0.5:54321",
  ])("refuses a remote API URL (%s)", (url) => {
    expect(() =>
      resolveLocalSupabaseEnv({ ...VARIABLES, SUPABASE_TEST_URL: url }),
    ).toThrow(`outside a local Supabase: ${url}`);
  });

  it("refuses a remote database without printing its password", () => {
    const dbUrl = "postgresql://postgres:secret@db.abcdefgh.supabase.co:5432/x";
    expect(() =>
      resolveLocalSupabaseEnv({ ...VARIABLES, SUPABASE_TEST_DB_URL: dbUrl }),
    ).toThrow(/^Database tests refused outside a local Postgres$/);
  });

  it("refuses when `supabase status` gives no URL", () => {
    const readStatus = () => ({ ...LOCAL, url: "" });
    expect(() => resolveLocalSupabaseEnv({}, readStatus)).toThrow(
      "outside a local Supabase",
    );
  });

  it("reads process.env and `supabase status` by default", () => {
    vi.mocked(spawnSync).mockReturnValue({
      status: 0,
      stdout: JSON.stringify({
        API_URL: LOCAL.url,
        DB_URL: LOCAL.dbUrl,
        PUBLISHABLE_KEY: LOCAL.anonKey,
        SECRET_KEY: LOCAL.serviceRoleKey,
      }),
    } as ReturnType<typeof spawnSync>);
    for (const name of Object.keys(VARIABLES)) vi.stubEnv(name, "");

    expect(resolveLocalSupabaseEnv()).toEqual(LOCAL);
    vi.unstubAllEnvs();
  });
});

describe("readLocalSupabaseStatus", () => {
  const mockStatus = (status: number | null, stdout: string) => {
    vi.mocked(spawnSync).mockReturnValue({ status, stdout } as ReturnType<
      typeof spawnSync
    >);
  };

  it("reads `supabase status -o json`, after any notice", () => {
    mockStatus(
      0,
      `Stopped services: [supabase_studio]\n${JSON.stringify({
        API_URL: LOCAL.url,
        DB_URL: LOCAL.dbUrl,
        PUBLISHABLE_KEY: LOCAL.anonKey,
        SECRET_KEY: LOCAL.serviceRoleKey,
        ANON_KEY: "legacy-anon",
      })}`,
    );
    expect(readLocalSupabaseStatus({})).toEqual(LOCAL);
    expect(spawnSync).toHaveBeenCalledWith(
      "npx supabase status -o json",
      expect.objectContaining({ shell: true }),
    );
  });

  it("falls back to the legacy JWT keys and SUPABASE_CLI", () => {
    mockStatus(
      0,
      JSON.stringify({
        ANON_KEY: "legacy-anon",
        SERVICE_ROLE_KEY: "legacy-service",
      }),
    );
    expect(readLocalSupabaseStatus({ SUPABASE_CLI: "supabase" })).toEqual({
      url: "",
      dbUrl: "",
      anonKey: "legacy-anon",
      serviceRoleKey: "legacy-service",
    });
    expect(spawnSync).toHaveBeenCalledWith(
      "supabase status -o json",
      expect.anything(),
    );
  });

  it("returns empty values when the status has no keys", () => {
    mockStatus(0, "{}");
    expect(readLocalSupabaseStatus({})).toEqual({
      url: "",
      dbUrl: "",
      anonKey: "",
      serviceRoleKey: "",
    });
  });

  it.each([
    [1, '{"message":"not running"}'],
    [0, "no JSON"],
  ])(
    "explains how to start Supabase when the CLI fails (%s)",
    (status, stdout) => {
      mockStatus(status, stdout);
      expect(() => readLocalSupabaseStatus({})).toThrow(/supabase start/);
    },
  );
});

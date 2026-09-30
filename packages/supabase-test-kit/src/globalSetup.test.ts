import { afterEach, describe, expect, it, vi } from "vitest";

import setup from "./globalSetup.js";

const VARIABLES = {
  SUPABASE_TEST_URL: "http://127.0.0.1:54321",
  SUPABASE_TEST_DB_URL:
    "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  SUPABASE_TEST_ANON_KEY: "anon",
  SUPABASE_TEST_SERVICE_ROLE_KEY: "service",
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("globalSetup", () => {
  it("resolves the local Supabase from process.env", () => {
    for (const [name, value] of Object.entries(VARIABLES)) {
      vi.stubEnv(name, value);
    }
    expect(() => {
      setup();
    }).not.toThrow();
  });

  it("refuses a remote Supabase", () => {
    for (const [name, value] of Object.entries(VARIABLES)) {
      vi.stubEnv(name, value);
    }
    vi.stubEnv("SUPABASE_TEST_URL", "https://abcdefgh.supabase.co");
    expect(() => {
      setup();
    }).toThrow("outside a local Supabase");
  });
});

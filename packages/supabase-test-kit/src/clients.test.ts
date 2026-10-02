import { createClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTestClients } from "./clients.js";

const signInWithPassword = vi.fn();
const enroll = vi.fn();
const challengeAndVerify = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn((url: string, key: string) => ({
    url,
    key,
    auth: { signInWithPassword, mfa: { enroll, challengeAndVerify } },
  })),
}));

const RFC_SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

const env = {
  url: "http://127.0.0.1:54321",
  anonKey: "anon",
  serviceRoleKey: "service",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createTestClients", () => {
  const clients = createTestClients(env);
  const options = { auth: { persistSession: false, autoRefreshToken: false } };

  it("creates a service role client", () => {
    expect(clients.admin()).toMatchObject({ key: "service" });
    expect(createClient).toHaveBeenCalledWith(env.url, "service", options);
  });

  it("creates a signed-out client", () => {
    expect(clients.anon()).toMatchObject({ key: "anon" });
    expect(createClient).toHaveBeenCalledWith(env.url, "anon", options);
  });

  it("signs a fresh anon client in", async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    const client = await clients.signIn({
      email: "a@test.invalid",
      password: "pw",
    });
    expect(client).toMatchObject({ key: "anon" });
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "a@test.invalid",
      password: "pw",
    });
  });

  it("throws when the sign-in fails", async () => {
    const error = new Error("Invalid login credentials");
    signInWithPassword.mockResolvedValue({ error });
    await expect(
      clients.signIn({ email: "a@test.invalid", password: "wrong" }),
    ).rejects.toBe(error);
  });
});

describe("signInWithTotp", () => {
  const clients = createTestClients(env);

  it("signs in, enrolls a TOTP factor and verifies it with the current code", async () => {
    vi.useFakeTimers({ now: 59_000 });
    signInWithPassword.mockResolvedValue({ error: null });
    enroll.mockResolvedValue({
      data: { id: "factor-1", totp: { secret: RFC_SECRET } },
      error: null,
    });
    challengeAndVerify.mockResolvedValue({ error: null });

    const client = await clients.signInWithTotp({
      email: "admin@test.invalid",
      password: "pw",
    });

    expect(client).toMatchObject({ key: "anon" });
    expect(enroll).toHaveBeenCalledWith({ factorType: "totp" });
    expect(challengeAndVerify).toHaveBeenCalledWith({
      factorId: "factor-1",
      code: "287082",
    });
    vi.useRealTimers();
  });

  it("throws when the verification fails", async () => {
    const error = new Error("Invalid TOTP code");
    signInWithPassword.mockResolvedValue({ error: null });
    enroll.mockResolvedValue({
      data: { id: "factor-1", totp: { secret: RFC_SECRET } },
      error: null,
    });
    challengeAndVerify.mockResolvedValue({ error });
    await expect(
      clients.signInWithTotp({ email: "admin@test.invalid", password: "pw" }),
    ).rejects.toBe(error);
  });
});

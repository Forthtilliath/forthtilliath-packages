import { createClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTestClients } from "./clients.js";

const signInWithPassword = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn((url: string, key: string) => ({
    url,
    key,
    auth: { signInWithPassword },
  })),
}));

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

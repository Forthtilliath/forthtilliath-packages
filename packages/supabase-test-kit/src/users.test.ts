import type { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTestUsers } from "./users.js";

const createUser = vi.fn();
const deleteUser = vi.fn();
const admin = () =>
  ({ auth: { admin: { createUser, deleteUser } } }) as unknown as Pick<
    SupabaseClient,
    "auth"
  >;

let nextId = 0;

beforeEach(() => {
  vi.clearAllMocks();
  createUser.mockImplementation(() =>
    Promise.resolve({
      data: { user: { id: `user-${++nextId}` } },
      error: null,
    }),
  );
  deleteUser.mockResolvedValue({ error: null });
});

describe("createTestUsers", () => {
  it("creates a confirmed account with a random .invalid email", async () => {
    const users = createTestUsers({ admin, emailPrefix: "rls" });
    const user = await users.create({ userMetadata: { first_name: "Ada" } });

    expect(user.id).toMatch(/^user-\d+$/);
    expect(user.email).toMatch(/^rls-[0-9a-f-]{36}@test\.invalid$/);
    expect(user.password).toMatch(/^Pw-[0-9a-f-]{36}$/);
    expect(createUser).toHaveBeenCalledWith({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { first_name: "Ada" },
      app_metadata: undefined,
    });
  });

  it("uses a default email prefix", async () => {
    const user = await createTestUsers({ admin }).create();
    expect(user.email).toMatch(/^test-/);
  });

  it("throws when the account can't be created", async () => {
    const error = new Error("Database error creating new user");
    createUser.mockResolvedValueOnce({ data: { user: null }, error });
    await expect(createTestUsers({ admin }).create()).rejects.toBe(error);
  });

  it("deletes the created accounts after the cleanup hook", async () => {
    const calls: string[] = [];
    const beforeDelete = vi.fn((ids: string[]) => {
      calls.push(`beforeDelete ${ids.join(",")}`);
      return Promise.resolve();
    });
    deleteUser.mockImplementation((id: string) => {
      calls.push(`delete ${id}`);
      return Promise.resolve({ error: null });
    });
    const users = createTestUsers({ admin, beforeDelete });
    const a = await users.create();
    const b = await users.create();

    await users.cleanup();

    expect(calls).toEqual([
      `beforeDelete ${a.id},${b.id}`,
      `delete ${a.id}`,
      `delete ${b.id}`,
    ]);
  });

  it("does nothing when no account was created since the last cleanup", async () => {
    const beforeDelete = vi.fn();
    const users = createTestUsers({ admin, beforeDelete });
    await users.create();
    await users.cleanup();
    await users.cleanup();

    expect(beforeDelete).toHaveBeenCalledOnce();
    expect(deleteUser).toHaveBeenCalledOnce();
  });

  it("deletes every account before reporting a failed deletion", async () => {
    const error = Object.assign(new Error("Database error deleting user"), {
      status: 500,
    });
    deleteUser.mockResolvedValueOnce({ error });
    const users = createTestUsers({ admin });
    await users.create();
    await users.create();

    await expect(users.cleanup()).rejects.toBe(error);
    expect(deleteUser).toHaveBeenCalledTimes(2);
  });

  it("skips accounts the test already deleted", async () => {
    const notFound = Object.assign(new Error("User not found"), {
      status: 404,
    });
    deleteUser.mockResolvedValueOnce({ error: notFound });
    const users = createTestUsers({ admin });
    await users.create();

    await expect(users.cleanup()).resolves.toBeUndefined();
  });
});

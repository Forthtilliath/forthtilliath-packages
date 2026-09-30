import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

export interface TestUser {
  id: string;
  email: string;
  password: string;
}

export interface CreateTestUserOptions {
  /** Stored in `raw_user_meta_data`, e.g. for a `handle_new_user` trigger. */
  userMetadata?: Record<string, unknown>;
  appMetadata?: Record<string, unknown>;
}

export interface TestUsersOptions {
  /** Returns a service role client (see `createTestClients().admin`). */
  admin: () => Pick<SupabaseClient, "auth">;
  /** Start of the generated emails (defaults to `"test"`). */
  emailPrefix?: string;
  /**
   * Runs before the accounts are deleted, with their ids: delete here the rows
   * that reference them without `ON DELETE CASCADE` (profiles, logs…).
   */
  beforeDelete?: (ids: string[]) => Promise<void>;
}

export interface TestUsers {
  /** Creates a confirmed account with a random email and password. */
  create: (options?: CreateTestUserOptions) => Promise<TestUser>;
  /**
   * Deletes every account created since the last cleanup, skipping those the
   * test deleted itself.
   */
  cleanup: () => Promise<void>;
}

/**
 * Creates throwaway, confirmed accounts and deletes them all at once, e.g. in
 * `afterAll`. Emails use the reserved `.invalid` domain: no mail can leave.
 *
 * @param options - The admin client, an email prefix and a cleanup hook.
 * @returns `{ create, cleanup }`.
 * @example
 * const users = createTestUsers({
 *   admin: clients.admin,
 *   beforeDelete: async (ids) => {
 *     await clients.admin().from("profiles").delete().in("id", ids);
 *   },
 * });
 * afterAll(users.cleanup);
 * const user = await users.create();
 */
export function createTestUsers({
  admin,
  emailPrefix = "test",
  beforeDelete,
}: TestUsersOptions): TestUsers {
  const createdIds: string[] = [];

  return {
    create: async ({ userMetadata, appMetadata } = {}) => {
      const email = `${emailPrefix}-${randomUUID()}@test.invalid`;
      const password = `Pw-${randomUUID()}`;
      const { data, error } = await admin().auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: userMetadata,
        app_metadata: appMetadata,
      });
      if (error) throw error;
      const { id } = data.user;
      createdIds.push(id);
      return { id, email, password };
    },

    cleanup: async () => {
      const ids = createdIds.splice(0);
      if (ids.length === 0) return;
      await beforeDelete?.(ids);
      const client = admin();
      // Deletes every account even if one fails, then reports the first error.
      // An account the test already deleted itself (404) is fine.
      const errors: Error[] = [];
      for (const id of ids) {
        const { error } = await client.auth.admin.deleteUser(id);
        if (error && error.status !== 404) errors.push(error);
      }
      if (errors[0]) throw errors[0];
    },
  };
}

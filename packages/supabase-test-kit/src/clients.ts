import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

import type { LocalSupabaseEnv } from "./env.js";

// No session kept between calls: every client starts signed out
const CLIENT_OPTIONS = {
  auth: { persistSession: false, autoRefreshToken: false },
};

export interface Credentials {
  email: string;
  password: string;
}

export interface TestClients<Database> {
  /** Service role client: bypasses RLS, to prepare and check data. */
  admin: () => SupabaseClient<Database>;
  /** Signed-out visitor. */
  anon: () => SupabaseClient<Database>;
  /** A new client signed in with these credentials (subject to RLS). */
  signIn: (credentials: Credentials) => Promise<SupabaseClient<Database>>;
}

/**
 * Creates the three kinds of clients an RLS test needs, each call returning a
 * fresh client.
 *
 * @param env - The local Supabase (see `resolveLocalSupabaseEnv`).
 * @returns `{ admin, anon, signIn }`.
 * @example
 * const clients = createTestClients<Database>(resolveLocalSupabaseEnv());
 * const member = await clients.signIn({ email, password });
 * const { data } = await member.from("members").select("*");
 */
export function createTestClients<Database>(
  env: Pick<LocalSupabaseEnv, "url" | "anonKey" | "serviceRoleKey">,
): TestClients<Database> {
  const client = (key: string) =>
    createClient<Database>(env.url, key, CLIENT_OPTIONS);
  const anon = () => client(env.anonKey);
  return {
    admin: () => client(env.serviceRoleKey),
    anon,
    signIn: async ({ email, password }) => {
      const signedIn = anon();
      const { error } = await signedIn.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return signedIn;
    },
  };
}

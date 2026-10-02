import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

import type { LocalSupabaseEnv } from "./env.js";
import { totpCode } from "./totp.js";

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
  /**
   * A new client signed in with these credentials, then with a TOTP factor
   * enrolled and verified on the spot: a full MFA session (`aal2`), for RLS
   * rules that require it. Each call enrolls a new factor — keep the client
   * if the account signs in often (Auth limits factors and verifications).
   */
  signInWithTotp: (
    credentials: Credentials,
  ) => Promise<SupabaseClient<Database>>;
}

/**
 * Creates the kinds of clients an RLS test needs, each call returning a fresh
 * client.
 *
 * @param env - The local Supabase (see `resolveLocalSupabaseEnv`).
 * @returns `{ admin, anon, signIn, signInWithTotp }`.
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
  const signIn = async ({ email, password }: Credentials) => {
    const signedIn = anon();
    const { error } = await signedIn.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return signedIn;
  };
  return {
    admin: () => client(env.serviceRoleKey),
    anon,
    signIn,
    signInWithTotp: async (credentials) => {
      const signedIn = await signIn(credentials);
      const { data: factor, error } = await signedIn.auth.mfa.enroll({
        factorType: "totp",
      });
      if (error) throw error;
      const { error: verifyError } = await signedIn.auth.mfa.challengeAndVerify(
        {
          factorId: factor.id,
          code: totpCode(factor.totp.secret),
        },
      );
      if (verifyError) throw verifyError;
      return signedIn;
    },
  };
}

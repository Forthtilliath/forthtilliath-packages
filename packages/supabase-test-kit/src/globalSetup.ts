import { resolveLocalSupabaseEnv } from "./env.js";

/**
 * Vitest global setup (see `supabaseTestConfig`): reads the local Supabase
 * once, before the workers start, which then inherit the `SUPABASE_TEST_*`
 * variables instead of running `supabase status` for each test file.
 */
export default function setup(): void {
  resolveLocalSupabaseEnv();
}

import { fileURLToPath } from "node:url";

/**
 * The Vitest `test` options returned by {@link supabaseTestConfig}, to spread
 * into `defineConfig({ test: { … } })`.
 */
export interface SupabaseTestConfig {
  /** Node: the tests talk to a real Supabase over the network. */
  environment: "node";
  /**
   * `false`: test files share one database, so they run one after the other.
   */
  fileParallelism: boolean;
  /** Per-test timeout in ms, sized for real network round trips. */
  testTimeout: number;
  /** Per-hook timeout in ms (`beforeAll` creating accounts and data). */
  hookTimeout: number;
  /** Replace it with your own list including it, not without it. */
  globalSetup: string[];
}

/**
 * `test` options for a database suite: one shared database, so files run one
 * after the other, room for real network round trips, and a global setup
 * reading the local Supabase once (see `resolveLocalSupabaseEnv`). Lives at
 * the root entry, not in `./vitest`, which a config file must not import.
 *
 * @example
 * // vitest.db.config.ts
 * export default defineConfig({
 *   test: { ...supabaseTestConfig, include: ["tests/db/**\/*.test.ts"] },
 * });
 */
export const supabaseTestConfig: SupabaseTestConfig = {
  environment: "node",
  fileParallelism: false,
  testTimeout: 30_000,
  hookTimeout: 30_000,
  globalSetup: [fileURLToPath(new URL("globalSetup.js", import.meta.url))],
};

import { fileURLToPath } from "node:url";

export interface SupabaseTestConfig {
  environment: "node";
  fileParallelism: boolean;
  testTimeout: number;
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

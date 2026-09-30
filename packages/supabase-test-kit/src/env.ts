import { spawnSync } from "node:child_process";

export interface LocalSupabaseEnv {
  /** API URL (`http://127.0.0.1:54321`). */
  url: string;
  /** Direct Postgres connection string, as superuser. */
  dbUrl: string;
  anonKey: string;
  serviceRoleKey: string;
}

type Env = Record<string, string | undefined>;

const VARIABLES = {
  url: "SUPABASE_TEST_URL",
  dbUrl: "SUPABASE_TEST_DB_URL",
  anonKey: "SUPABASE_TEST_ANON_KEY",
  serviceRoleKey: "SUPABASE_TEST_SERVICE_ROLE_KEY",
} as const;

const LOCAL_HOST = String.raw`(127\.0\.0\.1|localhost)`;
const LOCAL_API = new RegExp(String.raw`^http://${LOCAL_HOST}:\d+/?$`);
const LOCAL_DB = new RegExp(String.raw`@${LOCAL_HOST}:\d+/`);

/**
 * Reads the URLs and keys of the running local Supabase from
 * `supabase status -o json` (`SUPABASE_CLI` overrides the command, default
 * `npx supabase`), in the current directory's project.
 *
 * @param env - Where to read `SUPABASE_CLI` from.
 * @returns The local Supabase.
 * @throws {Error} If the CLI fails, e.g. when Supabase isn't started.
 */
export function readLocalSupabaseStatus(
  env: Env = process.env,
): LocalSupabaseEnv {
  const cli = env.SUPABASE_CLI ?? "npx supabase";
  const result = spawnSync(`${cli} status -o json`, {
    shell: true,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const start = result.stdout.indexOf("{");
  if (result.status !== 0 || start === -1) {
    throw new Error(
      "Could not read the local Supabase (`supabase status`): is it started " +
        "(`supabase start`)? Or set SUPABASE_TEST_URL, SUPABASE_TEST_DB_URL, " +
        "SUPABASE_TEST_ANON_KEY and SUPABASE_TEST_SERVICE_ROLE_KEY.",
    );
  }
  const status = JSON.parse(result.stdout.slice(start)) as Env;
  // New API keys first, legacy JWT keys for older CLIs
  return {
    url: status.API_URL ?? "",
    dbUrl: status.DB_URL ?? "",
    anonKey: status.PUBLISHABLE_KEY ?? status.ANON_KEY ?? "",
    serviceRoleKey: status.SECRET_KEY ?? status.SERVICE_ROLE_KEY ?? "",
  };
}

/**
 * Resolves the local Supabase to run integration tests against, and refuses
 * anything else: these tests create, change and delete data, they must never
 * reach a hosted project.
 *
 * Reads `SUPABASE_TEST_URL`, `SUPABASE_TEST_DB_URL`, `SUPABASE_TEST_ANON_KEY`
 * and `SUPABASE_TEST_SERVICE_ROLE_KEY`; any missing one comes from
 * `supabase status` and is written back to `env`, so the CLI only runs once —
 * `supabaseTestConfig`'s global setup does it before the test workers start.
 *
 * @param env - Where to read and cache the values (defaults to `process.env`).
 * @param readStatus - Reads the running local Supabase.
 * @returns The URLs and keys of the local Supabase.
 * @throws {Error} If the API or the database URL isn't on localhost, or if
 *   `supabase status` fails while a value is missing.
 * @example
 * // tests/db/setup.ts (vitest `setupFiles`)
 * const supabase = resolveLocalSupabaseEnv();
 * process.env.NEXT_PUBLIC_SUPABASE_URL = supabase.url;
 */
export function resolveLocalSupabaseEnv(
  env: Env = process.env,
  readStatus: (env: Env) => LocalSupabaseEnv = readLocalSupabaseStatus,
): LocalSupabaseEnv {
  // An empty variable counts as missing
  const read = (name: string) => (env[name] === "" ? undefined : env[name]);
  const status = Object.values(VARIABLES).some((name) => !read(name))
    ? readStatus(env)
    : undefined;
  const resolve = (field: keyof LocalSupabaseEnv) => {
    const name = VARIABLES[field];
    // Cached for the next calls, and for the workers of a global setup
    env[name] = read(name) ?? status?.[field] ?? "";
    return env[name];
  };
  const url = resolve("url");
  const dbUrl = resolve("dbUrl");
  const anonKey = resolve("anonKey");
  const serviceRoleKey = resolve("serviceRoleKey");

  if (!LOCAL_API.test(url)) {
    throw new Error(`Database tests refused outside a local Supabase: ${url}`);
  }
  if (!LOCAL_DB.test(dbUrl)) {
    // The connection string holds a password: never print it
    throw new Error("Database tests refused outside a local Postgres");
  }
  return { url, dbUrl, anonKey, serviceRoleKey };
}

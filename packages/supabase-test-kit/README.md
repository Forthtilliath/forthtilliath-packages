# @forthtilliath/supabase-test-kit

Integration tests against a local Supabase (`supabase start`), for projects
whose security lives in RLS policies and SQL functions:

- **guarded test clients** — service role, signed-out visitor, signed-in
  user — that refuse to run against anything but localhost;
- **throwaway users**, created confirmed and deleted in one call;
- a **schema security suite** (one Vitest call): RLS on every table, every
  table classified, no unintended read or write open to everyone or to
  visitors, a fixed `search_path` on `SECURITY DEFINER` functions,
  `plpgsql_check`, and a snapshot of the schema;
- **`supabase-db-drift`**, comparing production with that snapshot: migrations
  not applied, policies changed by hand in the dashboard…;
- **`supabase-gen-types`**, regenerating the database types without wiping
  the file when the generation fails.

## Install

```bash
npm install --save-dev @forthtilliath/supabase-test-kit @supabase/supabase-js pg vitest
```

| Entry point                               | Needs                   | Exports                                                                                                                                  |
| ----------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `@forthtilliath/supabase-test-kit`        | `@supabase/supabase-js` | `resolveLocalSupabaseEnv`, `createTestClients`, `createTestUsers`, `supabaseTestConfig`, `findSecurityViolations`, `diffCatalogs`, types |
| `@forthtilliath/supabase-test-kit/pg`     | `pg`                    | `pgQuery`, `readSchemaCatalog`, `readTables`, `readPolicies`, `findUnsafeSecurityDefiners`, `findPlpgsqlErrors`                          |
| `@forthtilliath/supabase-test-kit/vitest` | `pg`, `vitest`          | `defineSchemaSecurityTests`                                                                                                              |
| `@forthtilliath/supabase-test-kit/sql/*`  | —                       | `schema-catalog.sql`, `assert-service-role.sql`                                                                                          |

`pg` and `vitest` are optional peer dependencies, only needed by the entries
that use them. The two CLIs need neither.

## Usage

### Vitest config

```ts
// vitest.db.config.ts
import { supabaseTestConfig } from "@forthtilliath/supabase-test-kit";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Node, one file at a time (shared database), 30 s timeouts, and a global
    // setup reading the local Supabase once
    ...supabaseTestConfig,
    include: ["tests/db/**/*.test.ts"],
    setupFiles: ["tests/db/setup.ts"],
  },
});
```

```ts
// tests/db/setup.ts — only if app modules read the Supabase env vars
import { resolveLocalSupabaseEnv } from "@forthtilliath/supabase-test-kit";

const supabase = resolveLocalSupabaseEnv();
process.env.NEXT_PUBLIC_SUPABASE_URL = supabase.url;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabase.anonKey;
process.env.SUPABASE_SERVICE_ROLE_KEY = supabase.serviceRoleKey;
```

`resolveLocalSupabaseEnv()` reads `SUPABASE_TEST_URL`, `SUPABASE_TEST_DB_URL`,
`SUPABASE_TEST_ANON_KEY` and `SUPABASE_TEST_SERVICE_ROLE_KEY`; any missing one
comes from `supabase status` (the project in the current directory,
`SUPABASE_CLI` overriding the command) and is cached in `process.env`. No key
is hard-coded, so custom ports and keys work too. `supabaseTestConfig`'s
global setup runs it once before the workers start, which inherit the
variables: the CLI runs once per test run, not once per file. If you set your
own `globalSetup`, keep `...supabaseTestConfig.globalSetup` in the list.

It **throws if the API or the database isn't on localhost**: these tests
create and delete data.

### Clients and throwaway users

```ts
// tests/db/helpers.ts
import {
  createTestClients,
  createTestUsers,
  resolveLocalSupabaseEnv,
} from "@forthtilliath/supabase-test-kit";

import type { Database } from "@/types/database";

export const clients = createTestClients<Database>(resolveLocalSupabaseEnv());

export const users = createTestUsers({
  admin: clients.admin,
  emailPrefix: "rls", // rls-<uuid>@test.invalid
  // Rows referencing the accounts without ON DELETE CASCADE
  beforeDelete: async (ids) => {
    await clients.admin().from("profiles").delete().in("id", ids);
  },
});
```

```ts
// tests/db/profiles.test.ts
afterAll(users.cleanup);

it("a user only reads their own profile", async () => {
  const alice = await users.create();
  const bob = await users.create({ userMetadata: { name: "Bob" } });
  const asAlice = await clients.signIn(alice);

  const { data } = await asAlice.from("profiles").select("id");
  expect(data).toEqual([{ id: alice.id }]);
});
```

- `clients.admin()` — service role, bypasses RLS: to prepare and check data.
- `clients.anon()` — a signed-out visitor.
- `clients.signIn({ email, password })` — a fresh client signed in with these
  credentials, subject to RLS.
- `clients.signInWithTotp({ email, password })` — the same, then a TOTP factor
  enrolled and verified on the spot: a full MFA session (`aal2`), for rules
  that require it (e.g. admin rights gated on `auth.jwt() ->> 'aal'`). Each
  call enrolls a new factor: keep the client if the account signs in often,
  Auth limits factors and verifications.
- `totpCode(secret, now?)` — the current 6-digit TOTP code of a base32 secret
  (RFC 6238, no dependency): sign in a test account with a known factor, in a
  Playwright setup or a script.
- `users.create(options?)` — a confirmed account with a random email and
  password (`{ id, email, password }`); `userMetadata`/`appMetadata` reach
  e.g. a `handle_new_user` trigger.
- `users.cleanup()` — runs `beforeDelete(ids)`, then deletes every account
  created since the last cleanup. Accounts the test already deleted itself
  are skipped; any other failure is thrown once every account was tried.

### Schema security suite

```ts
// tests/db/security-rules.test.ts
import { resolveLocalSupabaseEnv } from "@forthtilliath/supabase-test-kit";
import { defineSchemaSecurityTests } from "@forthtilliath/supabase-test-kit/vitest";

defineSchemaSecurityTests({
  dbUrl: resolveLocalSupabaseEnv().dbUrl,
  // Every table of the public schema, classified: a new table fails the
  // suite until it's added here, which forces the decision.
  tableAccess: {
    posts: "public", // visitors read some or all rows
    categories: "authenticated", // any signed-in user reads every row
    profiles: "restricted", // limited reads, never USING (true)
  },
  // Intended write policies open to everyone: "<table>.<policy name>"
  openWritePolicies: ["contact_messages.Anyone can send a message"],
  // SQL functions only true for a signed-in user, besides auth.uid()/auth.role()
  authFunctions: ["get_my_role"],
});
```

Run it on a database built by the migrations (`supabase migration up --local`
first). It checks:

| Test                                                | Fails on                                                                                         |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| matches the snapshot built from the migrations      | any change of the schema fingerprint — run with `-u` after an intended change, and commit it     |
| has RLS enabled on every table                      | a table without RLS                                                                              |
| classifies every table in tableAccess               | a table missing from `tableAccess`, or an entry matching no table                                |
| opens no read to everyone on a restricted table     | a `SELECT`/`ALL` policy `USING (true)` on a `restricted` table                                   |
| lets visitors read public tables only               | a read policy reaching `anon`/`public` without a login condition, on a non-`public` table        |
| opens no write to everyone                          | a write policy with `USING (true)` or `WITH CHECK (true)`, unless in `openWritePolicies`         |
| lets visitors write nowhere                         | a write policy reaching `anon`/`public` without a login condition, unless in `openWritePolicies` |
| fixes the search_path of SECURITY DEFINER functions | a `SECURITY DEFINER` function without `SET search_path`                                          |
| only references existing objects (plpgsql_check)    | an unknown column or table in PL/pgSQL code, found before it runs                                |

"Login condition" is a heuristic: the expression calls `auth.uid()`,
`auth.role()` or one of `authFunctions`. Options: `snapshot` (path relative to
the test file, default `./__snapshots__/schema-catalog.json`, or `false`),
`plpgsqlCheck` (default `true`; needs the `plpgsql_check` extension, shipped
with Supabase's Postgres image).

The snapshot is the output of [`sql/schema-catalog.sql`](sql/schema-catalog.sql):
one row per table (RLS flags), column (type, nullability), policy, trigger,
function (body hash, `SECURITY DEFINER`, volatility, config) and constraint.
The same checks are available without Vitest: `findSecurityViolations(tables,
policies, options)` with the `./pg` readers.

### `supabase-db-drift`

```bash
supabase-db-drift --project-ref <ref>   # production (read-only)
supabase-db-drift --local               # local database
```

Reads the fingerprint of the database through the Supabase CLI
(`supabase db query`) and compares it with the snapshot: elements missing
from the database (migration not applied?), only in the database (changed by
hand?) or different. Exits with 1 on drift. Options: `--snapshot <path>`
(default `tests/db/__snapshots__/schema-catalog.json`), `--catalog <sql>`.

The CLI must be signed in (`supabase login`) or `SUPABASE_ACCESS_TOKEN` set.
`SUPABASE_CLI` overrides the command (default `npx supabase`). In GitHub
Actions, without installing the whole project:

```yaml
- uses: supabase/setup-cli@v1
  with:
    version: 2.118.0
- run: npx --yes -p @forthtilliath/supabase-test-kit@^0.1.0 supabase-db-drift --project-ref <ref>
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    SUPABASE_CLI: supabase
```

### `supabase-gen-types`

```bash
supabase-gen-types --project-id <id>   # from production
supabase-gen-types --local             # from the local database
```

Runs `supabase gen types typescript` and only replaces the output file
(`--output`, default `src/types/database.ts`) when it succeeds: a shell
redirection (`> database.ts`) empties the file as soon as the command starts,
even when it then fails. `--schema` defaults to `public`. The output isn't
formatted: run your formatter afterwards.

### `assert_service_role()`

[`sql/assert-service-role.sql`](sql/assert-service-role.sql) is a snippet to
copy into a migration: a guard for public functions meant for the service
role only (`PERFORM assert_service_role();` first thing in the body). Prefer
it over `REVOKE EXECUTE ... FROM anon, authenticated`: on the Supabase
Postgres image 17.6.1.111, a denied `EXECUTE` crashes the server — a single
anonymous RPC call restarted the database.

## Scripts

```bash
pnpm run build          # tsc -> dist/ (excludes *.test.ts)
pnpm run check-types    # tsc --noEmit, includes test files
pnpm run lint           # eslint
pnpm run test           # vitest run (the database and the CLI are faked)
pnpm run coverage       # vitest run --coverage
```

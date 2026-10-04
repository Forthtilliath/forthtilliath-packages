# @forthtilliath/supabase-test-kit

## 0.2.0

### Minor Changes

- 9ec9639: New `totpCode(secret, now?)`: the current 6-digit TOTP code of a base32 secret (RFC 6238, no dependency), to sign in MFA test accounts from tests, Playwright setups or scripts. New `clients.signInWithTotp(credentials)`: signs in, then enrolls and verifies a TOTP factor on the spot, for a full MFA session (`aal2`).

## 0.1.2

### Patch Changes

- 857caff: `supabase-db-drift` reads both output formats of `supabase db query --output-format json`: the plain array of rows printed in a regular terminal, and the `{ boundary, rows, warning }` envelope used when the CLI runs under an AI agent. 0.1.1 only read the envelope, so the command failed with "Unexpected output from the Supabase CLI" when run by hand.

## 0.1.1

### Patch Changes

- 4dfc36b: `supabase-db-drift` reads the last JSON document of the `supabase db query` output: the CLI may print another one before the result (while initialising its login role), which made the command crash with a `SyntaxError`. An output without a readable result now fails with a clear message (exit code 1). New `parseQueryOutput` function.

## 0.1.0

### Minor Changes

- 02da15e: New package `@forthtilliath/supabase-test-kit`: integration tests against a local Supabase. `resolveLocalSupabaseEnv` (URLs and keys from `SUPABASE_TEST_*` or `supabase status`, refuses anything but localhost), `createTestClients` (service role, visitor, signed-in user), `createTestUsers` (throwaway confirmed accounts and cleanup), `supabaseTestConfig` (with a global setup reading the local Supabase once); `./vitest`'s `defineSchemaSecurityTests` registers a schema security suite (snapshot of the schema, RLS everywhere, every table classified, no unintended open read or write, `search_path` of `SECURITY DEFINER` functions, `plpgsql_check`), also available as `findSecurityViolations` and the `./pg` readers. Two CLIs: `supabase-db-drift` compares production with the snapshot, `supabase-gen-types` regenerates the database types without wiping the file on failure. Extracted from the Chœur des Anjoués site.

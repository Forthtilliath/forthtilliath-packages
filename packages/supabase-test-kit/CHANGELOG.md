# @forthtilliath/supabase-test-kit

## 0.1.0

### Minor Changes

- 02da15e: New package `@forthtilliath/supabase-test-kit`: integration tests against a local Supabase. `resolveLocalSupabaseEnv` (URLs and keys from `SUPABASE_TEST_*` or `supabase status`, refuses anything but localhost), `createTestClients` (service role, visitor, signed-in user), `createTestUsers` (throwaway confirmed accounts and cleanup), `supabaseTestConfig` (with a global setup reading the local Supabase once); `./vitest`'s `defineSchemaSecurityTests` registers a schema security suite (snapshot of the schema, RLS everywhere, every table classified, no unintended open read or write, `search_path` of `SECURITY DEFINER` functions, `plpgsql_check`), also available as `findSecurityViolations` and the `./pg` readers. Two CLIs: `supabase-db-drift` compares production with the snapshot, `supabase-gen-types` regenerates the database types without wiping the file on failure. Extracted from the Chœur des Anjoués site.

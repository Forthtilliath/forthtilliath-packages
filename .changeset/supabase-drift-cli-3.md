---
"@forthtilliath/supabase-test-kit": minor
---

`supabase-db-drift` now needs the Supabase CLI 3.x: it runs `db query --remote=<ref> --read-only` (`--read-only` alone with `--local`), which a token scoped to the project with Database: Read is enough for, instead of the deprecated `--linked --project-ref` (which created a temporary login role). When the CLI fails, its JSON error (message and suggestion, printed on stdout) is now shown instead of being swallowed. A project ref that is not lowercase letters and digits is refused.

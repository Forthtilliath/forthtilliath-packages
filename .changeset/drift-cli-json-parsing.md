---
"@forthtilliath/supabase-test-kit": patch
---

`supabase-db-drift` reads the last JSON document of the `supabase db query` output: the CLI may print another one before the result (while initialising its login role), which made the command crash with a `SyntaxError`. An output without a readable result now fails with a clear message (exit code 1). New `parseQueryOutput` function.

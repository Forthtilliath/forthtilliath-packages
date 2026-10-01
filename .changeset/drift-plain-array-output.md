---
"@forthtilliath/supabase-test-kit": patch
---

`supabase-db-drift` reads both output formats of `supabase db query --output-format json`: the plain array of rows printed in a regular terminal, and the `{ boundary, rows, warning }` envelope used when the CLI runs under an AI agent. 0.1.1 only read the envelope, so the command failed with "Unexpected output from the Supabase CLI" when run by hand.

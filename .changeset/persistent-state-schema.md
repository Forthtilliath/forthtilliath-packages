---
"@forthtilliath/react-kit": minor
---

`usePersistentState` accepts an optional `schema` (any zod-style `safeParse`) that validates the stored value on every read; a rejected value falls back to `initialValue` instead of entering the app untyped. Also fixes `setValue` silently doing nothing when the stored JSON was corrupted.

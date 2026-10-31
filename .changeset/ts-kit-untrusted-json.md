---
"@forthtilliath/ts-kit": minor
---

`parseUntrustedJson(text, schema, options?)` (`security/`) reads JSON from outside the app all or nothing: empty, too long (checked before parsing), malformed, then `__proto__` / `constructor` / `prototype` keys dropped and any Standard Schema (zod, Valibot, ArkType) applied, with a message ready to show in French or English. `sanitizeIntegerInput` and `parseIntegerInput` (`number/`) clean and read a whole-number field while it's being typed.

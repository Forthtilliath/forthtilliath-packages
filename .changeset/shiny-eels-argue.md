---
"@forthtilliath/react-native-kit": patch
---

Document that the root barrel export should be avoided under Jest/CommonJS: `export *` re-exports are evaluated eagerly on `require()`, so requiring the barrel from any file pulls in every component's module graph — including native-module imports unavailable under Jest — even for files that only want an unrelated util.

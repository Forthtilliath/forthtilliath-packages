---
"@forthtilliath/eslint-config": patch
---

Excluded `coverage/**` from every variant's default ignores, alongside `dist/**` and `storybook-static/**`. Without it, a package with a vitest `coverage` report on disk (e.g. the generated `coverage/lcov-report/*.js`) crashed type-aware linting outright instead of being skipped.

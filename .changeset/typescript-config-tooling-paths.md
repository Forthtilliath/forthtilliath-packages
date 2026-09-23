---
"@forthtilliath/typescript-config": patch
---

Presets now only carry `compilerOptions`: removed the `${configDir}`-based `include`/`exclude` and `@/*` `paths` from `nextjs.json`/`react.json` (and the relative `include`/`exclude` from `angular.json`, which resolved inside `node_modules`). `tsc` understands `${configDir}`, but the tools resolving imports at build/test time don't — Turbopack ignored the alias (every `@/…` import failed to resolve) and `vite-tsconfig-paths` ignored the `include` (Vitest suites failed). Declare `include`/`exclude`/`paths` in your own tsconfig; the README shows a complete Next.js example.

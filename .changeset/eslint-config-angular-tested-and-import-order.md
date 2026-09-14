---
"@forthtilliath/eslint-config": minor
---

`angularConfig` is now actually tested: `src/angular.test.js` lints fixture files under `src/__fixtures__/angular/` through ESLint's Node API — the only variant with no real consumer in this monorepo to catch it breaking. `angularConfig` also gets a `simple-import-sort/imports` override so `@angular/core`/`rxjs` sort before every other package, ahead of the generic third-party group `baseConfig` uses elsewhere (the conventional Angular reading order). `base.js` exports its Node builtins regex as `NODE_BUILTIN_IMPORT_GROUP` so `angular.js` doesn't duplicate it. README gets a quick-reference table of every variant (subpath, use case, what it extends).

---
"@forthtilliath/typescript-config": minor
"@forthtilliath/eslint-config": minor
---

`@forthtilliath/typescript-config` is now published to npm (was private) so apps outside this monorepo can extend it. Its presets now use `${configDir}` (TypeScript 5.5+) for `include`/`exclude` and the `@/*` path alias, so they resolve against the consuming project instead of `node_modules/@forthtilliath/typescript-config/` — a Next.js app now only needs `{ "extends": "@forthtilliath/typescript-config/nextjs.json" }`. `nextjs.json` also carries everything `create-next-app` generates (`allowJs`, `noEmit`, `incremental`, ESNext + DOM libs, `.next/dev/types`), plus `noImplicitOverride` and `noFallthroughCasesInSwitch`.

`@forthtilliath/eslint-config` gains a `snakeCase` option (default `false`) accepting `snake_case` variable names in `@typescript-eslint/naming-convention`, for code destructuring rows straight from a SQL/Supabase database; the rule is now built by an exported `createNamingConventionRule` shared by `base.js` and `react.js`. `createNextJsConfig` also ignores `out/**` and `build/**`, matching `eslint-config-next`'s defaults.

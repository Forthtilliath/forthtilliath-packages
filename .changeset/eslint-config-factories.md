---
"@forthtilliath/eslint-config": minor
---

Make every config variant customizable via factory functions (`createBaseConfig`, `createReactConfig`, `createNextJsConfig`, `createAngularConfig`, `createStorybookConfig`) accepting `{ prettier, strict, turbo }` options. The existing `baseConfig`/`reactConfig`/etc. exports are unchanged (just that factory called with no arguments).

Also fixes `nextJsConfig`, which was duplicating `reactConfig`'s logic instead of extending it — it now genuinely inherits React/`eslint-react`/`react-refresh` rules, and no longer re-applies `tseslint.configs.recommended` on top of `baseConfig`'s stricter presets.

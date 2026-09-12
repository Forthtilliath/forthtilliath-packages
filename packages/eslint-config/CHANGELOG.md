# @forthtilliath/eslint-config

## 0.2.0

### Minor Changes

- 736a462: Make every config variant customizable via factory functions (`createBaseConfig`, `createReactConfig`, `createNextJsConfig`, `createAngularConfig`, `createStorybookConfig`) accepting `{ prettier, strict, turbo }` options. The existing `baseConfig`/`reactConfig`/etc. exports are unchanged (just that factory called with no arguments).

  Also fixes `nextJsConfig`, which was duplicating `reactConfig`'s logic instead of extending it — it now genuinely inherits React/`eslint-react`/`react-refresh` rules, and no longer re-applies `tseslint.configs.recommended` on top of `baseConfig`'s stricter presets.

## 0.1.0

### Minor Changes

- fad18f8: `@forthtilliath/eslint-config` is now a public package, publishable outside this monorepo — install it in any project (`npm install --save-dev @forthtilliath/eslint-config`) to get the same shared flat configs (`baseConfig`, `reactConfig`, `nextJsConfig`, `storybookConfig`, `angularConfig`) via a single import, without installing each underlying ESLint plugin yourself. The ESLint plugins each variant actually uses now ship as regular `dependencies` of this package instead of `devDependencies`; `eslint`/`typescript` are `peerDependencies`.

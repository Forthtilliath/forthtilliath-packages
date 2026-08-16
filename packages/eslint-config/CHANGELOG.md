# @forthtilliath/eslint-config

## 0.1.0

### Minor Changes

- fad18f8: `@forthtilliath/eslint-config` is now a public package, publishable outside this monorepo — install it in any project (`npm install --save-dev @forthtilliath/eslint-config`) to get the same shared flat configs (`baseConfig`, `reactConfig`, `nextJsConfig`, `storybookConfig`, `angularConfig`) via a single import, without installing each underlying ESLint plugin yourself. The ESLint plugins each variant actually uses now ship as regular `dependencies` of this package instead of `devDependencies`; `eslint`/`typescript` are `peerDependencies`.

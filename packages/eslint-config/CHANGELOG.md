# @forthtilliath/eslint-config

## 0.4.0

### Minor Changes

- 19f1eae: Add `createReactNativeConfig`/`reactNativeConfig` (`@forthtilliath/eslint-config/react-native`) for React Native / Expo apps:

  - Extends `createReactConfig`, with `a11y` defaulting to `false` (jsx-a11y targets DOM semantics, which doesn't apply to RN).
  - Adds `eslint-plugin-react-native`'s `no-unused-styles`, `no-single-element-style-arrays`, `split-platform-components`, and `no-raw-text` rules (`no-inline-styles`/`sort-styles` stay off, being stylistic rather than correctness checks).
  - Adds the RN/Metro-injected `__DEV__` global.

## 0.3.0

### Minor Changes

- dd87f25: Add `a11y` (default `true`), `i18n` (default `false`), and `testingLibrary` (default `false`) options to `createReactConfig`/`createNextJsConfig`/`createStorybookConfig`:

  - `a11y`: `eslint-plugin-jsx-a11y`'s recommended rules, bundled by default like `eslint-config-next` used to.
  - `i18n`: `eslint-plugin-i18next`'s `no-literal-string` rule, opt-in — only makes sense for a project fully committed to i18n.
  - `testingLibrary`: `eslint-plugin-testing-library` + `eslint-plugin-jest-dom`, scoped to test files, opt-in — `no-manual-cleanup` assumes `afterEach` is a real global (vitest `test.globals: true`), which isn't every project's setup.

  Also adds `alt`/`size`/`contentType` to `createNextJsConfig`'s `react-refresh` `allowExportNames`, for `icon.tsx`/`opengraph-image.tsx`/`twitter-image.tsx`'s App Router convention.

## 0.2.1

### Patch Changes

- 49a400f: Pin `@eslint/js` to the 9.x line instead of `^10.0.1`. `@eslint/js@10` declares a hard `peerDependencies.eslint: "^10.0.0"`, which silently forced every consumer onto ESLint 10 even though this package's own peer range (`eslint: ">=9.0.0"`) says ESLint 9 is supported — surfaced as an ERESOLVE conflict the moment a consumer still on ESLint 9 installed this package.

## 0.2.0

### Minor Changes

- 736a462: Make every config variant customizable via factory functions (`createBaseConfig`, `createReactConfig`, `createNextJsConfig`, `createAngularConfig`, `createStorybookConfig`) accepting `{ prettier, strict, turbo }` options. The existing `baseConfig`/`reactConfig`/etc. exports are unchanged (just that factory called with no arguments).

  Also fixes `nextJsConfig`, which was duplicating `reactConfig`'s logic instead of extending it — it now genuinely inherits React/`eslint-react`/`react-refresh` rules, and no longer re-applies `tseslint.configs.recommended` on top of `baseConfig`'s stricter presets.

## 0.1.0

### Minor Changes

- fad18f8: `@forthtilliath/eslint-config` is now a public package, publishable outside this monorepo — install it in any project (`npm install --save-dev @forthtilliath/eslint-config`) to get the same shared flat configs (`baseConfig`, `reactConfig`, `nextJsConfig`, `storybookConfig`, `angularConfig`) via a single import, without installing each underlying ESLint plugin yourself. The ESLint plugins each variant actually uses now ship as regular `dependencies` of this package instead of `devDependencies`; `eslint`/`typescript` are `peerDependencies`.

---
"@forthtilliath/eslint-config": minor
---

Add `a11y` (default `true`), `i18n` (default `false`), and `testingLibrary` (default `false`) options to `createReactConfig`/`createNextJsConfig`/`createStorybookConfig`:

- `a11y`: `eslint-plugin-jsx-a11y`'s recommended rules, bundled by default like `eslint-config-next` used to.
- `i18n`: `eslint-plugin-i18next`'s `no-literal-string` rule, opt-in — only makes sense for a project fully committed to i18n.
- `testingLibrary`: `eslint-plugin-testing-library` + `eslint-plugin-jest-dom`, scoped to test files, opt-in — `no-manual-cleanup` assumes `afterEach` is a real global (vitest `test.globals: true`), which isn't every project's setup.

Also adds `alt`/`size`/`contentType` to `createNextJsConfig`'s `react-refresh` `allowExportNames`, for `icon.tsx`/`opengraph-image.tsx`/`twitter-image.tsx`'s App Router convention.

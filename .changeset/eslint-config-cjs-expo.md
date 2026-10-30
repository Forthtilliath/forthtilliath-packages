---
"@forthtilliath/eslint-config": minor
---

Loads from a CommonJS `eslint.config.js` (the one Expo's templates generate): optional plugins are now loaded synchronously, only when their option is on, instead of through a top-level `await` that made `require()` fail with `ERR_REQUIRE_ASYNC_MODULE`. `turbo` now defaults to `true` only inside a Turborepo (a `turbo.json` in ESLint's working directory or above), so a standalone app no longer has to pass `turbo: false`. New `expo` option in `createReactNativeConfig`: enables eslint-plugin-expo's `use-dom-exports`, `no-env-var-destructuring` and `no-dynamic-env-var` rules (needs `eslint-plugin-expo` installed).

---
"@forthtilliath/eslint-config": minor
---

Add `createReactNativeConfig`/`reactNativeConfig` (`@forthtilliath/eslint-config/react-native`) for React Native / Expo apps:

- Extends `createReactConfig`, with `a11y` defaulting to `false` (jsx-a11y targets DOM semantics, which doesn't apply to RN).
- Adds `eslint-plugin-react-native`'s `no-unused-styles`, `no-single-element-style-arrays`, `split-platform-components`, and `no-raw-text` rules (`no-inline-styles`/`sort-styles` stay off, being stylistic rather than correctness checks).
- Adds the RN/Metro-injected `__DEV__` global.

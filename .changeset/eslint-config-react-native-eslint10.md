---
"@forthtilliath/eslint-config": patch
---

Fix `createReactNativeConfig` crashing under ESLint 10: `eslint-plugin-react-native@5.0.0` still calls `context.getSourceCode()`, an API ESLint 10 removed. Turn off `no-unused-styles` and `no-single-element-style-arrays` (the two default-on rules that used it) until the plugin ships a fix.

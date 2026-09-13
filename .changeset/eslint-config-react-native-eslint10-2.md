---
"@forthtilliath/eslint-config": patch
---

`react-native/split-platform-components` also crashes under ESLint 10 (`context.getFilename is not a function`), same root cause as the previous fix. Turn it off too, along with `no-color-literals` (same crash, was already off but now documented). `no-raw-text` is the only `eslint-plugin-react-native` rule left enabled by default — the only one that survives ESLint 10.

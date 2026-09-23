---
"@forthtilliath/eslint-config": minor
---

`createReactConfig` (and every variant built on it: nextjs, storybook, react-native) no longer enables the 9 eslint-plugin-react-hooks rules that `@eslint-react`'s `recommended-type-checked` preset already implements under the same name (`rules-of-hooks`, `exhaustive-deps`, `static-components`, `use-memo`, `set-state-in-effect`, `error-boundaries`, `purity`, `set-state-in-render`, `unsupported-syntax`). Each problem used to be reported twice, and a disable comment had to name both plugins. Only the `@eslint-react/*` versions remain (its `purity` also catches `new Date()` during render, which the react-hooks one misses). Consumers with `// eslint-disable… react-hooks/<rule>` comments for these rules should switch them to `@eslint-react/<rule>` (ESLint reports the old ones as unused directives). A test now fails if a new overlap appears.

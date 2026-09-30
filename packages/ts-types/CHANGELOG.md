# @forthtilliath/ts-types

## 0.3.0

### Minor Changes

- 47e6bae: Remove `helpers` (`StoryComponent`, `StoryDecorator`, `StoryArgumentsWithKey`) from the root barrel: they depend on React's types, which broke `import … from "@forthtilliath/ts-types"` in a React-free project (Angular, Node) with `skipLibCheck: false`. Import them from `@forthtilliath/ts-types/helpers` instead. `@types/react` is now declared as an optional peer dependency.

### Patch Changes

- c1bd669: Declare `sideEffects` (`false`, or `["*.css"]` for `forth-ui`/`shadcn-ui`) so bundlers can tree-shake unused modules, root barrels included. Internal dependencies are now published as caret ranges (`^0.4.0`) instead of exact versions.
- c1bd669: `Merge<F, S>`: a property both types declare with incompatible types now resolves to `S`'s type. It used to collapse the whole result into an index signature accepting anything (`F & S` reduced that property to `never`, so `keyof (F & S)` became `string | number | symbol`). Optional and readonly modifiers are kept.

## 0.2.0

### Minor Changes

- f4652cf: Added `DeepPartial`/`DeepReadonly` to `object`, and four new categories: `brand` (`Brand`, `Opaque`), `function` (`AsyncReturnType`), `union` (`UnionToTuple`) and `common` (`Nullable`, `Maybe`). All are exported from the root barrel and from their own `@forthtilliath/ts-types/<category>` subpath.

## 0.1.0

### Minor Changes

- 5ea7fd8: First release. Renamed from `@forthtilliath/types` — leaves room for future per-language type packages (e.g. Java/Angular) instead of one generic `types` name. No code changes.

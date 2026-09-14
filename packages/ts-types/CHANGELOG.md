# @forthtilliath/ts-types

## 0.2.0

### Minor Changes

- f4652cf: Added `DeepPartial`/`DeepReadonly` to `object`, and four new categories: `brand` (`Brand`, `Opaque`), `function` (`AsyncReturnType`), `union` (`UnionToTuple`) and `common` (`Nullable`, `Maybe`). All are exported from the root barrel and from their own `@forthtilliath/ts-types/<category>` subpath.

## 0.1.0

### Minor Changes

- 5ea7fd8: First release. Renamed from `@forthtilliath/types` — leaves room for future per-language type packages (e.g. Java/Angular) instead of one generic `types` name. No code changes.

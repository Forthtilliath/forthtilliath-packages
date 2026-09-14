# @forthtilliath/ts-types

Generic TypeScript utility **types** (no runtime code) — the kind of small
helpers usually found in libraries like `type-fest` or `ts-toolbelt`, kept
in-house here so the rest of the monorepo doesn't need an extra dependency.

## Install

```json
{
  "devDependencies": {
    "@forthtilliath/ts-types": "workspace:*"
  }
}
```

## Usage

```ts
import type { NonEmptyArray } from "@forthtilliath/ts-types/array";
import type { Brand, Opaque } from "@forthtilliath/ts-types/brand";
import type { Maybe, Nullable } from "@forthtilliath/ts-types/common";
import type { AsyncReturnType } from "@forthtilliath/ts-types/function";
import type {
  DeepPartial,
  DeepReadonly,
  Entries,
  ExactRecord,
  KeysMatching,
  Merge,
  Prettify,
  RecordValues,
  UnknownRecord,
} from "@forthtilliath/ts-types/object";
import type {
  StoryComponent,
  StoryDecorator,
} from "@forthtilliath/ts-types/helpers";
import type { UnionToTuple } from "@forthtilliath/ts-types/union";
```

Also available as one barrel: `import type { ... } from "@forthtilliath/ts-types"`.

### `array`

- `NonEmptyArray<T>` — `[T, ...T[]]`, forces at least one element.

### `object`

- `UnknownRecord` — `Record<PropertyKey, unknown>`, the base constraint most
  of the other object types build on.
- `ExactRecord<T>` — enforces the exact shape of an object (no excess
  properties slipping through structural typing).
- `RecordValues<T>` — union of an object's value types.
- `Entries<T>` — the `[key, value]` tuple shape of `Object.entries(obj)`.
- `KeysMatching<T, V>` — keys of `T` whose value type extends `V`.
- `Merge<F, S>` — flattens an intersection (`F & S`) into a single object
  type, with `S`'s keys taking priority over `F`'s.
- `Prettify<T>` — cosmetic only: expands a type alias into its full object
  shape in editor tooltips, instead of showing the alias name.
- `DeepPartial<T>` — recursively makes all properties (including nested
  objects and array items) optional.
- `DeepReadonly<T>` — recursively makes all properties (including nested
  objects and array items) readonly.

### `brand`

- `Brand<T, B>` / `Opaque<T, B>` — nominal typing: tags a primitive type
  (e.g. `Brand<string, "UserId">`) so values with the same runtime shape but
  different brands can't be mixed up by mistake.

### `common`

- `Nullable<T>` — `T | null`.
- `Maybe<T>` — `T | null | undefined`.

### `function`

- `AsyncReturnType<T>` — resolved value type of an async function
  (`Awaited<ReturnType<T>>`, constrained to async functions).

### `union`

- `UnionToTuple<T>` — turns a union into a tuple of its members (order not
  guaranteed; best for small, stable unions).

### `helpers`

- `StoryComponent<T>` / `StoryDecorator<T>` / `StoryArgumentsWithKey<T>` —
  typing helpers for Storybook decorators and custom story render functions.

## Scripts

```bash
pnpm run build        # tsc -> dist/
pnpm run dev           # tsc --watch
pnpm run check-types   # tsc --noEmit
pnpm run lint          # eslint
```

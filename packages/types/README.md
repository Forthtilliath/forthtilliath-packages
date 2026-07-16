# @forthtilliath/types

Generic TypeScript utility **types** (no runtime code) — the kind of small
helpers usually found in libraries like `type-fest` or `ts-toolbelt`, kept
in-house here so the rest of the monorepo doesn't need an extra dependency.

## Install

```json
{
  "devDependencies": {
    "@forthtilliath/types": "workspace:*"
  }
}
```

## Usage

```ts
import type { NonEmptyArray } from "@forthtilliath/types/array";
import type {
  Entries,
  ExactRecord,
  KeysMatching,
  Merge,
  Prettify,
  RecordValues,
  UnknownRecord,
} from "@forthtilliath/types/object";
import type {
  StoryComponent,
  StoryDecorator,
} from "@forthtilliath/types/helpers";
```

Also available as one barrel: `import type { ... } from "@forthtilliath/types"`.

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

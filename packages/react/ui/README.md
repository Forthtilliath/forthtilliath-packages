# @forthtilliath/react-ui

Tiny headless React control-flow components — no styling, no dependencies
beyond React. The kind of one-off helpers (`Show`, `Repeat`, render-prop
slots) that otherwise get copy-pasted into every project.

## Install

```json
{
  "dependencies": {
    "@forthtilliath/react-ui": "workspace:*"
  }
}
```

## Usage

```tsx
import { Repeat, Show, SlotOrCallback } from "@forthtilliath/react-ui";
```

### `Show<T>`

Conditionally renders `children`, with an optional `fallback`. When `when` is
a value (not just a boolean), `children` can be a render function that
receives the narrowed, non-nullish value:

```tsx
<Show when={user} fallback={<Spinner />}>
  {(u) => <p>Hello {u.name}</p>}
</Show>
```

### `Repeat`

Renders `children` `count` times. `children` can be a static node or a
render function receiving the current index:

```tsx
<Repeat count={5}>{(i) => <Star key={i} />}</Repeat>
```

### `SlotOrCallback`

Accepts `children` as either a plain React node or a function-as-children
render prop, and normalizes both into a rendered node — used internally by
components that want to support both patterns without duplicating logic.

## Scripts

```bash
pnpm run dev            # tsup --watch (cjs + esm + .d.ts, for main/module/types fallback)
pnpm run build          # tsup (cjs + esm + .d.ts)
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
```

The `exports` field points straight at `src/index.ts`/`src/*.tsx`, so
Vite/bundler-based consumers in this workspace get the TypeScript source
directly and never need `dist/`. The `tsup` build (`main`/`module`/`types`
fields) exists as a fallback for tooling that doesn't honor `exports`.

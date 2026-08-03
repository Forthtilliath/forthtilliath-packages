# @forthtilliath/react-kit

Small React building blocks — hooks and headless control-flow components —
with no styling opinions. The web-React counterpart to
`@forthtilliath/react-native-kit`. Formerly published as two separate
packages, `@forthtilliath/react-hooks` and `@forthtilliath/react-ui` (both
now deprecated in favor of this one).

## Install

```bash
npm install @forthtilliath/react-kit
```

Or, from within this monorepo, as a workspace dependency:

```json
{
  "dependencies": {
    "@forthtilliath/react-kit": "workspace:*"
  }
}
```

## Usage

Each hook/component is its own module — import the file you need directly:

```ts
import {
  SPECIAL_KEYS,
  useKeyListener,
} from "@forthtilliath/react-kit/useKeyListener";
import { useToggleState } from "@forthtilliath/react-kit/useToggleState";
import { Repeat, type RepeatProps } from "@forthtilliath/react-kit/repeat";
import { Show, type ShowProps } from "@forthtilliath/react-kit/show";
import {
  SlotOrCallback,
  type SlotOrCallbackProps,
} from "@forthtilliath/react-kit/slot-or-callback";
```

### `useKeyListener(config, onKeyDown)`

Attaches a `window` `keydown` listener and calls `onKeyDown` when the event
matches every modifier specified in `config` (`key`, `ctrl`, `shift`, `alt`,
`meta` — all optional, unset ones are ignored). Also exports a
`SPECIAL_KEYS` constant (`ENTER`, `SPACE`, `ESCAPE`, `BACKSPACE`, `TAB`) for
the `key` field:

```ts
useKeyListener({ key: SPECIAL_KEYS.ESCAPE }, () => setOpen(false));
useKeyListener({ key: "s", ctrl: true }, save);
```

### `useToggleState(defaultValue?)`

Like `useState` for a boolean, plus a ready-made toggler:

```ts
const [isOpen, setIsOpen, toggleOpen] = useToggleState(false);
```

Returns `[value, setValue, toggle] as const`.

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
pnpm run dev            # tsc --watch -> dist/
pnpm run build          # tsc -> dist/
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
pnpm run test           # vitest run
pnpm run test:watch     # vitest
```

Everything is built to `dist/` (see the `exports` field in `package.json`),
so run `pnpm run build` (or `dev`) after source changes for consumers to see
them.

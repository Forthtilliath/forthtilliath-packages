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
import { usePersistentState } from "@forthtilliath/react-kit/usePersistentState";
import { useDebounce } from "@forthtilliath/react-kit/useDebounce";
import { useThrottle } from "@forthtilliath/react-kit/useThrottle";
import { useMediaQuery } from "@forthtilliath/react-kit/useMediaQuery";
import { useClickOutside } from "@forthtilliath/react-kit/useClickOutside";
import { useOnlineStatus } from "@forthtilliath/react-kit/useOnlineStatus";
import { useIntersectionObserver } from "@forthtilliath/react-kit/useIntersectionObserver";
import { useCopyToClipboard } from "@forthtilliath/react-kit/useCopyToClipboard";
import { useControllableState } from "@forthtilliath/react-kit/useControllableState";
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

### `useDebounce(value, delayMs)`

Returns a debounced copy of `value`, updated only once it has stopped
changing for `delayMs` — the classic guard against firing a request/filter
on every keystroke:

```ts
const debouncedQuery = useDebounce(query, 300);
```

### `useThrottle(value, limitMs)`

Returns a throttled copy of `value`, updated at most once per `limitMs`
(immediately on the first change, then on a trailing edge so the final value
is never dropped). Suited to high-frequency sources (scroll, resize,
pointer move):

```ts
const throttledScrollY = useThrottle(scrollY, 200);
```

### `useMediaQuery(query)`

Tracks whether a CSS media query currently matches. SSR-safe — returns
`false` until mounted, then stays in sync:

```ts
const isDesktop = useMediaQuery("(min-width: 1024px)");
```

### `useClickOutside(onClickOutside)`

Returns a ref; calls `onClickOutside` on a pointer event outside that ref's
element — the pattern behind closing a dropdown/popover/modal on an outside
click:

```ts
const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
```

### `useOnlineStatus()`

Tracks `navigator.onLine`, updated live via the `online`/`offline` events:

```ts
const isOnline = useOnlineStatus();
```

### `useIntersectionObserver(options?)`

Returns `[ref, isIntersecting]` for the returned ref's element — the
building block behind lazy-loading, infinite scroll and scroll-triggered
animations. Pass `once: true` to stop observing after the first time it
becomes visible:

```ts
const [ref, isVisible] = useIntersectionObserver<HTMLImageElement>({
  once: true,
});
```

### `useCopyToClipboard(resetDelayMs?)`

Returns `[copiedText, copy]`. `copy(text)` writes to the clipboard and
resolves to whether it succeeded; `copiedText` holds the last copied value
and auto-clears after `resetDelayMs` (default `2000`) — handy for a
"Copied!" button state:

```ts
const [copiedText, copy] = useCopyToClipboard();
```

### `useControllableState({ value?, defaultValue?, onChange? })`

Backs a headless component that must support both controlled (`value` +
`onChange`, parent owns the state) and uncontrolled (`defaultValue`,
component owns the state) usage through a single code path:

```ts
const [pressed, setPressed] = useControllableState({
  value,
  defaultValue,
  onChange,
});
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

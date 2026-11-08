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
import {
  getTabbableElements,
  useFocusTrap,
} from "@forthtilliath/react-kit/useFocusTrap";
import { useScrollLock } from "@forthtilliath/react-kit/useScrollLock";
import { useOnlineStatus } from "@forthtilliath/react-kit/useOnlineStatus";
import { useIntersectionObserver } from "@forthtilliath/react-kit/useIntersectionObserver";
import { useCopyToClipboard } from "@forthtilliath/react-kit/useCopyToClipboard";
import { useControllableState } from "@forthtilliath/react-kit/useControllableState";
import { useHorizontalScroll } from "@forthtilliath/react-kit/useHorizontalScroll";
import { Repeat, type RepeatProps } from "@forthtilliath/react-kit/repeat";
import { Show, type ShowProps } from "@forthtilliath/react-kit/show";
import {
  SlotOrCallback,
  type SlotOrCallbackProps,
} from "@forthtilliath/react-kit/slot-or-callback";
import { FocusOnMount } from "@forthtilliath/react-kit/focus-on-mount";
import { JsonLd } from "@forthtilliath/react-kit/json-ld";
import {
  createToastStore,
  useToasts,
} from "@forthtilliath/react-kit/createToastStore";
import { useServiceWorker } from "@forthtilliath/react-kit/useServiceWorker";
import { ServiceWorkerRegister } from "@forthtilliath/react-kit/service-worker-register";
```

### `useKeyListener(config, onKeyDown)`

Attaches a `window` `keydown` listener and calls `onKeyDown(event)` when the
event matches `config`:

- `key` — `KeyboardEvent.key` to match; any key when omitted.
- `ctrl`, `alt`, `meta` — must match **exactly** (`false` by default): `{ key:
"s" }` doesn't fire on Ctrl+S, so it never clashes with a browser/OS
  shortcut.
- `shift` — only checked when specified, since Shift is often needed to type
  the key itself (`"?"`, uppercase letters…).

`onKeyDown` can be an inline function: the listener is only re-attached when
`config`'s values change. Also exports a `SPECIAL_KEYS` constant (`ENTER`,
`SPACE`, `ESCAPE`, `BACKSPACE`, `TAB`) for the `key` field:

```ts
useKeyListener({ key: SPECIAL_KEYS.ESCAPE }, () => setOpen(false));
useKeyListener({ key: "s", ctrl: true }, (event) => {
  event.preventDefault(); // keep the browser's "Save page" dialog closed
  save();
});
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

### `useFocusTrap(ref, active, options?)` / `useScrollLock(active)`

The two behaviours of an accessible modal or drawer, for a project without
Radix (a shadcn project gets them from `Dialog`):

- `useFocusTrap` keeps Tab / Shift+Tab inside `ref`'s element while
  `active`, and pulls back focus that escaped it. It focuses the first
  tabbable element on activation (`autoFocus`, default `true`) and gives
  focus back to the previous element on release (`restoreFocus`, default
  `true`). Elements with `tabindex="-1"` (inactive tabs) are skipped; the
  same list is exported as `getTabbableElements(root)`.
- `useScrollLock` blocks page scrolling while `active` and replaces the
  vanished scrollbar by an equal `padding-right`, so the page does not
  shift.

```tsx
const dialogRef = useRef<HTMLDivElement>(null);
useFocusTrap(dialogRef, isOpen);
useScrollLock(isOpen);
useKeyListener({ key: SPECIAL_KEYS.ESCAPE }, () => {
  if (isOpen) onClose();
});

return isOpen ? (
  <div ref={dialogRef} role="dialog" aria-modal="true">
    …
  </div>
) : null;
```

### `usePersistentState(key, initialValue, { schema? })`

State persisted to `localStorage` as JSON, SSR-safe and kept in sync across
tabs. Returns `{ value, setValue, clear, hydrated }`; `setValue` accepts an
updater function. `initialValue` and `schema` must be stable (module-level
constants). A stored value that is corrupted or rejected by `schema` (any
object with a zod-style `safeParse`, e.g. a zod schema) is replaced by
`initialValue`, never applied. When `localStorage` refuses a write (blocked
storage, quota exceeded), the value is kept in memory for the session: the
state still changes, it is just not persisted.

```ts
const SETTINGS_DEFAULTS = { reroll: true };
const settingsSchema = z.object({ reroll: z.boolean() });

const { value, setValue } = usePersistentState("settings", SETTINGS_DEFAULTS, {
  schema: settingsSchema,
});
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
becomes visible. `ref` is a callback ref: an element rendered conditionally,
after the first render, is observed as soon as it mounts:

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

### `useHorizontalScroll<TInner>({ step?, keyboard? })`

Tracks whether a horizontally scrollable container can scroll further left
or right — for edge shadows or arrow buttons — kept in sync via a
`ResizeObserver` on the container (`scrollRef`) and its content
(`innerRef`). `scrollByStep(-1 | 1)` smooth-scrolls by `step` px (default
`240`); the left/right arrow keys do the same unless focus is in a form field
(`keyboard: false` to opt out). Call `updateScrollState` from `onScroll`.
`scrollRef`/`innerRef` are callback refs, so a container rendered
conditionally is tracked too:

```tsx
const {
  scrollRef,
  innerRef,
  canScrollLeft,
  canScrollRight,
  updateScrollState,
  scrollByStep,
} = useHorizontalScroll<HTMLTableElement>();

<div ref={scrollRef} onScroll={updateScrollState} className="overflow-x-auto">
  <table ref={innerRef}>…</table>
</div>;
```

### `createToastStore<V>(defaults?)` / `useToasts(store)`

A dependency-free toast queue, declared once at module level and callable
from anywhere (a `catch` block, outside React). `show(message, variant,
{ durationMs? })` returns the toast's id; toasts leave after `durationMs`
(default `5000`, `0` or `Infinity` to keep them); `dismiss(id)`, `clear()`.
The rendering stays in the app, styled with its own theme: `useToasts(store)`
returns the current toasts (empty on the server). For a shadcn project,
`sonner` from `shadcn-ui` does the same with its own look.

```tsx
// lib/toast.ts
export const toasts = createToastStore<"error" | "success">();
export const toast = {
  error: (message: string) => toasts.show(message, "error"),
  success: (message: string) => toasts.show(message, "success"),
};

// Toaster.tsx ("use client")
const items = useToasts(toasts);
return items.map((t) => (
  <div key={t.id} role="alert">
    {t.message}
    <button onClick={() => toasts.dismiss(t.id)}>×</button>
  </div>
));
```

### `useServiceWorker(scriptUrl, options?)` / `ServiceWorkerRegister`

Registers a service worker once mounted (a PWA's offline mode), when the
browser supports it; a failure is ignored unless `onError` is given.
Options: `scope`, `type`, `updateViaCache`, `enabled` (`false` to skip, e.g.
in development). `ServiceWorkerRegister` is the same as a component that
renders nothing, to drop in a server layout:

```tsx
// app/layout.tsx
<body>
  <ServiceWorkerRegister src="/sw.js" />
  {children}
</body>
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
A render function is called with `args`, which is required as soon as the
function declares parameters:

```tsx
<SlotOrCallback args={[user]}>{(u) => <p>Hello {u.name}</p>}</SlotOrCallback>
```

### `FocusOnMount`

A `<div role="region">` that takes focus when it mounts, without scrolling
the page — to move keyboard and screen-reader focus to content that just
appeared (search results, an error summary), so it gets announced. `label`
becomes its accessible name:

```tsx
{
  results && (
    <FocusOnMount label="Search results">
      <p>{results.length} results found</p>
    </FocusOnMount>
  );
}
```

### `JsonLd`

Injects a JSON-LD `<script type="application/ld+json">` block (structured
data for search engines). `<` is escaped in the serialized JSON, so a value
containing `</script>` can't close the tag early; still build `data`
server-side from trusted values:

```tsx
<JsonLd
  data={{
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Acme",
  }}
/>
```

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

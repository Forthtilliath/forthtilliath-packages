# @forthtilliath/forth-ui

Higher-level, opinionated React components built on top of
[`@forthtilliath/shadcn-ui`](../shadcn-ui) primitives — `Accordion`,
`Avatar`/`AvatarGroup`, `Grid`/`Grid.Item`, `Repeat`. Styled with Tailwind CSS
and `class-variance-authority`. `private: true`, internal to this monorepo.

## Install

```json
{
  "dependencies": {
    "@forthtilliath/forth-ui": "workspace:*"
  }
}
```

Import the compiled Tailwind stylesheet once, alongside the component
imports below:

```ts
import "@forthtilliath/forth-ui/styles/globals.css";
```

## Usage

Each component is its own subpath — import the folder you need:

```tsx
import { Accordion } from "@forthtilliath/forth-ui/components/accordion";
import { Avatar, AvatarGroup } from "@forthtilliath/forth-ui/components/avatar";
import { Grid } from "@forthtilliath/forth-ui/components/grid";
import { Repeat } from "@forthtilliath/forth-ui/components/repeat";
```

### `Accordion`

Wraps Radix's `Accordion` primitive with variants and an icon slot.

```tsx
<Accordion
  items={[{ title: "Section 1", content: "..." }]}
  variant="outline"
  size="default"
/>

<Accordion multiple items={[...]} defaultValue={["item-0"]} />
```

- `variant`: `default` | `outline` | `box` | `contained` | `box-contained` |
  `tabs` | `highlight-active` (default `default`)
- `size`: `sm` | `default` | `lg` (default `default`)
- `multiple`: `false` (single-open, `defaultValue?: string`) or `true`
  (multi-open, `defaultValue?: string[]`, `collapsible` defaults to `true`)
- `icon` (shared across every item) **or** each item's own `icon` — using
  both throws at render time
- `hideChevron`, `chevronAlignment` (`"left" | "right"`), `customChevron`
- `classNameItem` / `classNameTrigger` / `classNameContent` for per-part
  styling, plus `generateId` to control item id generation

### `Avatar`

Wraps Radix's `Avatar` with a status dot, optional ring, shape/size
variants, and an optional tooltip.

```tsx
<Avatar
  src="/me.png"
  fallback="CN"
  size="lg"
  shape="circle"
  ring
  status="online"
  renderTooltip={() => "Connor"}
/>
```

- `size`: `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl`
- `shape`: `square` | `rounded` | `circle` (default `circle`)
- `ring`: boolean, default `false`
- `status`: `online` | `offline` | `away` | `busy` — renders a labeled dot
  (`sr-only` text from `STATUS_LABEL`)
- `position`: status dot placement
- `fallbackVariant`: fallback box color variant
- `renderTooltip`: `() => ReactNode` — wraps the avatar in a Radix tooltip
  when provided
- `className`: `{ root?, image?, fallback?, status?, tooltipTrigger?,
tooltipContent? }` for per-part overrides

### `AvatarGroup`

Renders overlapping avatars (`-space-x-2`) from an `AvatarProps[]` array:

```tsx
<AvatarGroup
  avatars={[{ fallback: "AB" }, { fallback: "CD", status: "busy" }]}
/>
```

### `Grid` / `Grid.Item`

CSS-grid layout helpers with a built-in debug overlay (press the
`debugKey`, default `"g"`, to toggle it while `debug` is on).

```tsx
<Grid cols={12} spacing="md" debug>
  <Grid.Item cols={4}>...</Grid.Item>
  <Grid.Item cols="full">...</Grid.Item>
</Grid>
```

- `Grid` props: `cols` (`1`–`12`, default `12`), `spacing` (`none` | `xs` |
  `sm` | `md` | `lg` | `xl`, default `md`), `debug`, `debugKey`
- `Grid.Item` props: `cols` (`default` | `2`–`12` | `full`)

### `Repeat`

```tsx
<Repeat count={3} renderItem={(i) => <li key={i}>Item {i}</li>} />
```

Renders `renderItem(index)` `count` times, wrapped in `React.Fragment` with
`keyItem(index)` (defaults to `index`) as the key.

## Scripts

```bash
pnpm run dev            # concurrently: tsc --watch + tailwind --watch
pnpm run build          # tsc + tailwind build -> dist/
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
```

Components are exported from `dist/` (`./components/*` →
`./dist/components/*/index.js`), so run `pnpm run build` (or `dev`) after
source changes for consumers to see them.

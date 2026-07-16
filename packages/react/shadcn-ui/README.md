# @forthtilliath/shadcn-ui

The [shadcn/ui](https://ui.shadcn.com) component library for this monorepo —
Radix UI primitives styled with Tailwind CSS, generated via the shadcn CLI
and kept in source form (not compiled) so consumers can customize freely.
`private: true`, internal to this monorepo.

> Distinct from [`@forthtilliath/forth-ui`](../forth-ui): this package is
> the (mostly) unmodified shadcn/ui base layer; `forth-ui` builds
> higher-level, opinionated components on top of it.

## Install

```json
{
  "dependencies": {
    "@forthtilliath/shadcn-ui": "workspace:*"
  }
}
```

## Usage

No build step — everything is consumed straight from `src/` (see the
`exports` field), so import components, lib helpers and hooks directly by
file name:

```tsx
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@forthtilliath/shadcn-ui/components/card";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";
import { useIsMobile } from "@forthtilliath/shadcn-ui/hooks/use-mobile";
import "@forthtilliath/shadcn-ui/styles/globals.css";
```

### Components (`src/components/`)

The full shadcn/ui primitive set: `accordion`, `alert`, `alert-dialog`,
`aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`,
`card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`,
`context-menu`, `data-table`, `dialog`, `drawer`, `dropdown-menu`, `form`,
`hover-card`, `input`, `input-otp`, `label`, `menubar`, `navigation-menu`,
`pagination`, `popover`, `progress`, `radio-group`, `resizable`,
`scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`,
`slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toggle`,
`toggle-group`, `tooltip`.

### Blocks (`src/components/blocks/`)

Larger, composed patterns built from the primitives above: `accordion`,
`animated-tabs`, `animated-text`, `avatar`, `calendar-date-picker`,
`data-table` (+ `data-table-ext/pagination`), `field`, `form`, `navbar-01`,
`navbar-02`, `navbar-04`.

### Lib (`src/lib/`)

- `utils.ts` — `cn()`, the `clsx` + `tailwind-merge` class-name helper used
  by every component.
- `react-hook-form.ts`, `recharts.ts`, `input-otp.ts`, `sonner.ts` —
  library-specific glue/re-exports for those components.

### Hooks (`src/hooks/`)

- `use-mobile.ts` — `useIsMobile()`, a media-query hook used by `sidebar`.

### Themes (`src/styles/themes/`)

`globals.css` imports `themes/default.css`. Ten additional
[tweakcn](https://tweakcn.com)-generated theme files are available to swap
in instead: `blue`, `bubblegum`, `claymorphism`, `green`, `orange`, `red`,
`rose`, `twitter`, `violet`, `yellow`. `globals-static.css` is a
non-`@theme inline` variant for tooling that doesn't support Tailwind v4's
CSS-first theming.

## Scripts

```bash
pnpm run check-types   # tsc --noEmit
pnpm run lint          # eslint
```

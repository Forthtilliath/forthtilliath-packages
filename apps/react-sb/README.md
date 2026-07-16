# react-sb

Storybook workspace for this monorepo — documents and tests every component
from [`@forthtilliath/shadcn-ui`](../../packages/react/shadcn-ui),
[`@forthtilliath/forth-ui`](../../packages/react/forth-ui), and
[`@forthtilliath/react-ui`](../../packages/react/ui).

## Develop

```bash
corepack pnpm run dev:sb    # from the repo root, or:
corepack pnpm --filter react-sb dev
```

Open [http://localhost:6006](http://localhost:6006).

## Story organization

```
src/stories/
├── shadcn-ui/        # one file per shadcn/ui primitive (button, dialog, ...)
│   └── blocks/        # composed blocks (data-table, navbar-01, ...)
├── forth-ui/          # accordion, avatar, avatar-group, grid, repeat
└── ui/                # headless components: show, repeat, slot-or-callback
```

Each story file mirrors the component's props/variants and includes
interaction tests (`play` functions) using Testing Library queries.

## Testing

Stories double as component tests via `@storybook/addon-vitest`, run in a
real browser (Playwright/Chromium):

```bash
pnpm run test    # vitest run — executes every story's play function
```

## Scripts

```bash
pnpm run dev               # storybook dev -p 6006
pnpm run build-storybook   # static Storybook build (runs build:tw:once first)
pnpm run preview            # vite preview
pnpm run check-types        # tsc --noEmit
pnpm run lint                # eslint (includes eslint-plugin-storybook)
pnpm run test                 # vitest run
pnpm run dev:tw                # tailwind --watch for .storybook/globals.css
```

## Stack

- [Storybook](https://storybook.js.org) 9 (`@storybook/react-vite`),
  with `addon-docs`, `addon-themes` (theme switcher toolbar), `addon-vitest`
- [Vitest](https://vitest.dev/) browser mode (`@vitest/browser` + Playwright)
- [Vite](https://vitejs.dev/) + `@vitejs/plugin-react`

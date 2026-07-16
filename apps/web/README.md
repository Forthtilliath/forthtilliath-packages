# web

The Next.js showcase app for this monorepo — demonstrates
[`@forthtilliath/shadcn-ui`](../../packages/react/shadcn-ui) blocks and
[`@forthtilliath/react-ui`](../../packages/react/ui) control-flow
components in a real App Router app.

## Develop

```bash
corepack pnpm run dev:web    # from the repo root, or:
corepack pnpm --filter web dev
```

Open [http://localhost:3000](http://localhost:3000). Turbopack dev server,
hot reload on save.

## Routes

- `/` — animated-text and theme-aware image demos
  ([`app/page.tsx`](app/page.tsx))
- `/table` — `DataTable` block backed by TanStack Table
  ([`app/table/page.tsx`](app/table/page.tsx))

## Scripts

```bash
pnpm run dev            # next dev --turbopack --port 3000
pnpm run build          # next build
pnpm run start          # next start (serves the production build)
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
```

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [React](https://react.dev) 19
- `@forthtilliath/shadcn-ui`, `@forthtilliath/react-ui`,
  `@forthtilliath/types` — internal workspace packages
- [TanStack Query](https://tanstack.com/query) / [Table](https://tanstack.com/table)
- [Zod](https://zod.dev)

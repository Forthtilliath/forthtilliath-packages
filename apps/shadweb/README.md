# shadweb

**Acme Analytics** — a fictional SaaS dashboard built entirely from
[`@forthtilliath/shadcn-ui`](../../packages/react/shadcn-ui), consumed the
same way a downstream project would: as an installed package, not raw
source aliasing.

The point of this app isn't the UI itself — it's proof that the package
works as a real dependency. `package.json` declares
`"@forthtilliath/shadcn-ui": "workspace:*"` like any other npm dependency,
and pnpm resolves it through the package's own `exports` map. If something
here breaks, it likely means the package would break for a real consumer
too.

## Develop

```bash
corepack pnpm run dev:shadweb   # from the repo root, or:
corepack pnpm --filter shadweb dev
```

Open [http://localhost:3001](http://localhost:3001). Turbopack dev server,
hot reload on save.

## Routes

| Route         | Demonstrates                                                                      |
| ------------- | --------------------------------------------------------------------------------- |
| `/`           | Dashboard — stat cards, revenue chart, recent orders                              |
| `/customers`  | `DataTable` block — search, sorting, pagination                                   |
| `/team`       | `Sheet` invite panel, `ContextMenu`, `HoverCard`, `Tooltip`, `blocks/avatar`      |
| `/billing`    | `AlertDialog`-gated plan switch, usage meters, `CalendarDatePicker`, `Pagination` |
| `/support`    | `NavigationMenu`, `Menubar`, `Drawer`, `Accordion`, `Carousel`, `ScrollArea`      |
| `/settings`   | `Form` block (react-hook-form + zod) and notification `Switch`es                  |
| `/components` | Every component in isolation — the exhaustive reference, not the homepage         |

The sidebar's `⌘K` command palette jumps between all of them.

## Scripts

```bash
pnpm run dev            # next dev --turbopack --port 3001
pnpm run build          # next build
pnpm run start          # next start (serves the production build)
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
```

## Design notes

- **Theme**: `app/layout.tsx` imports one theme file
  ([`violet.css`](../../packages/react/shadcn-ui/src/styles/themes)) —
  swapping it for any of the other 10 is the whole reskin. `apps/web` still
  hardcodes `twitter.css`; nothing here is special-cased for one theme.
- **No stray runtime dependencies**: components that internally need a
  peer package (`sonner`, `zod`, `@tanstack/react-table`, `recharts`,
  `react-hook-form`, `input-otp`) get it through
  [`@forthtilliath/shadcn-ui/lib/*`](../../packages/react/shadcn-ui/src/lib),
  not as a separate direct dependency here. `package.json` only lists what
  this app genuinely owns: `next`, `next-themes`, `lucide-react`.
- **Dark mode**: wired up for real via `next-themes` (`ThemeProvider` +
  `useTheme`), unlike `apps/web` which forces `className="dark"`.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [React](https://react.dev) 19
- `@forthtilliath/shadcn-ui` — the only internal workspace package this app
  depends on
- [next-themes](https://github.com/pacocoursey/next-themes) — light/dark/system
- [Lucide](https://lucide.dev) — icons

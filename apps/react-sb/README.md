# react-sb

Storybook workspace for this monorepo — documents and tests every component
from [`@forthtilliath/shadcn-ui`](../../packages/react/shadcn-ui),
[`@forthtilliath/forth-ui`](../../packages/react/forth-ui), and
[`@forthtilliath/react-kit`](../../packages/react-kit).

## Develop

```bash
pnpm run dev:sb    # from the repo root, or:
pnpm --filter react-sb dev
```

Open [http://localhost:6006](http://localhost:6006).

## Story organization

```
src/stories/
├── shadcn-ui/        # one file per shadcn/ui primitive (button, dialog, ...)
│   └── blocks/        # composed blocks (data-table, navbar-01, ...)
├── forth-ui/          # one file per forth-ui component (58 of them)
└── ui/                # headless components: show, repeat, slot-or-callback
```

Every story's `title` is prefixed with a category segment (e.g.
`"forth-ui/Forms/Combobox"`), so the Storybook sidebar groups both
`forth-ui/` and `shadcn-ui/` into the same 8 folders instead of one long
alphabetical list: **Layout**, **Navigation**, **Buttons & Actions**,
**Forms**, **Feedback**, **Overlays**, **Data Display**, and (`forth-ui`
only) **Code & Content**. Keep new stories consistent with this grouping —
see [`packages/react/forth-ui/README.md`](../../packages/react/forth-ui/README.md)
for which category each component belongs to.

Each story file mirrors the component's props/variants and includes
interaction tests (`play` functions) using Testing Library queries.

## Testing

Stories double as component tests via `@storybook/addon-vitest`, run in a
real browser (Playwright/Chromium):

```bash
pnpm run test    # vitest run — executes every story's play function
```

## Visual regression

A separate run (`vitest.visual.config.ts`, never part of `test` nor CI)
screenshots every story in light and dark mode and compares them with local
references, to catch any render change brought by a dependency upgrade
(shadcn components, Radix, Tailwind…) or a refactor.

```bash
pnpm --filter react-sb test:visual:baseline   # 1. on a clean state: (re)take the references
# 2. upgrade / change things
pnpm --filter react-sb test:visual            # 3. compare (~30 s)
pnpm --filter react-sb test:visual:accept <storyId…>   # 4. accept the wanted changes (or --all)
```

`test:visual` prints the stories whose render changed and writes
`visual/report.html`: before / after / diff of each one (cropped to the
story), with checkboxes that build the accept command. A story that is not
accepted keeps failing until fixed. New stories get their reference on their
first run and are listed for review.

Everything lives in `visual/` (ignored by git): `baseline/` (references),
`diff/`, `report.html`. References are local to the machine — rendering
differs from one OS to another, so they are not shared nor used by CI.

How the run stays deterministic (see `.storybook/visual.ts`):

- `Date` is frozen (`vi.useFakeTimers({ toFake: ["Date"] })`), remote images
  are replaced by a fixed placeholder, fonts and images are loaded, finite
  animations are finished and the others frozen before the screenshots;
- a difference has to show up twice (`retry: 1`) to be reported.

A story that still can't be screenshotted the same way twice takes a
parameter:

```ts
parameters: {
  visual: {
    delay: 5000;
  }
} // long JS animation: wait for its end
parameters: {
  visual: {
    disable: true;
  }
} // endless JS animation: skip it
```

## Scripts

```bash
pnpm run dev               # storybook dev -p 6006
pnpm run build-storybook   # static Storybook build (runs build:tw first)
pnpm run preview            # vite preview
pnpm run check-types        # tsc --noEmit
pnpm run lint                # eslint (includes eslint-plugin-storybook)
pnpm run test                 # vitest run
pnpm run test:visual           # visual regression (see above)
pnpm run dev:tw                # tailwind --watch for .storybook/globals.css
```

## Stack

- [Storybook](https://storybook.js.org) 10 (`@storybook/react-vite`),
  with `addon-docs`, `addon-themes` (theme switcher toolbar), `addon-a11y`,
  `addon-vitest`
- [Vitest](https://vitest.dev/) browser mode (`@vitest/browser` + Playwright)
- [Vite](https://vitejs.dev/) + `@vitejs/plugin-react`

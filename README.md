# @forthtilliath/turborepo

A pnpm + Turborepo monorepo: two Next.js apps and a Storybook
component-library workspace, sharing a set of internal React/UI/utility
packages.

> **Note (this machine only)**: the global `pnpm` binary is broken here —
> prefix every command with `corepack`, e.g. `corepack pnpm run dev:web`.

## Apps and packages

| Name                                                       | Description                                                            |
| ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`apps/web`](apps/web)                                     | Next.js showcase app, consumes `shadcn-ui` + `react-ui`                |
| [`apps/shadweb`](apps/shadweb)                             | Fictional dashboard app proving `shadcn-ui` works as an installed dep  |
| [`apps/react-sb`](apps/react-sb)                           | Storybook workspace documenting/testing every component                |
| [`packages/react/shadcn-ui`](packages/react/shadcn-ui)     | shadcn/ui component library (Radix + Tailwind), source-consumed        |
| [`packages/react/forth-ui`](packages/react/forth-ui)       | Higher-level components built on `shadcn-ui` (Accordion, Avatar, Grid) |
| [`packages/react/ui`](packages/react/ui)                   | Headless control-flow components (`Show`, `Repeat`, ...)               |
| [`packages/react/hooks`](packages/react/hooks)             | Standalone React hooks (`useKeyListener`, `useToggleState`)            |
| [`packages/types`](packages/types)                         | Generic TypeScript utility types, no runtime code                      |
| [`packages/lib`](packages/lib)                             | Framework-agnostic TS utility functions (not yet consumed anywhere)    |
| [`packages/eslint-config`](packages/eslint-config)         | Shared ESLint flat configs                                             |
| [`packages/typescript-config`](packages/typescript-config) | Shared `tsconfig.json` bases                                           |

Every package is 100% TypeScript.

## Getting started

```bash
corepack pnpm install
corepack pnpm run dev:web    # Next.js app on localhost:3000
corepack pnpm run dev:sb     # Storybook on localhost:6006
```

## Common commands

Run against the whole monorepo (via Turborepo, cached):

```bash
pnpm run build          # build all apps/packages
pnpm run dev             # dev mode for every app/package at once
pnpm run lint            # eslint everywhere
pnpm run check-types     # tsc --noEmit everywhere
pnpm run test            # vitest everywhere
pnpm run format           # prettier --write
pnpm run format:check     # prettier --check
pnpm run clean            # clean build artifacts everywhere
```

To work on a single app/package instead of everything:

```bash
pnpm run dev:web            # apps/web
pnpm run dev:shadweb         # apps/shadweb
pnpm run dev:sb              # apps/react-sb
pnpm run dev:forth-ui        # packages/react/forth-ui
pnpm run dev:react-ui        # packages/react/ui
pnpm run dev:lib             # packages/lib
pnpm run dev:types           # packages/types
pnpm run dev:eslint-config   # packages/eslint-config
```

`@forthtilliath/shadcn-ui` and `@forthtilliath/react-hooks` have no
`dev`/`build` script — their `exports` point straight at `src/*.ts(x)`,
consumed as-is by Vite/Storybook without a build step.

For anything not listed above, filter directly:

```bash
turbo run <task> --filter=<package-name>
pnpm -F "*<package-name>" <task>
```

## Tooling

- [TypeScript](https://www.typescriptlang.org/) — shared bases in
  `packages/typescript-config`
- [ESLint](https://eslint.org/) — flat config, typed linting, shared bases
  in `packages/eslint-config`
- [Prettier](https://prettier.io) — formatting, with the Tailwind class
  sorting plugin
- [Vitest](https://vitest.dev/) — unit/component tests (browser mode for
  Storybook stories, jsdom mode for hooks/lib)
- [lefthook](https://github.com/evilmartians/lefthook) — git hooks
  (`pnpm run prepare` installs them)
- [Renovate](https://docs.renovatebot.com/) — dependency update PRs
- [Turborepo](https://turborepo.com/) — task orchestration and caching

## Further reading

- [`UPGRADE.md`](UPGRADE.md) — running backlog of fixes, known debt, and
  upgrade history for this repo
- [`.doc/`](.doc) — additional notes (dev commands, linter setup,
  Storybook + Tailwind integration, themes, branching)

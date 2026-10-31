# forthtilliath-packages

A pnpm + Turborepo monorepo of the shared building blocks behind my apps:
React and React Native component kits, Expo modules for backups and in-app
updates, TypeScript utilities, test helpers and tooling configs — plus the
apps that showcase and test them. Every package is published to npm under
`@forthtilliath/*` and is 100% TypeScript.

## Packages

### React (web)

| Package                                 | Description                                                                                                                                               |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`shadcn-ui`](packages/react/shadcn-ui) | shadcn/ui component library (Radix + Tailwind), vendored as-is and published                                                                              |
| [`forth-ui`](packages/react/forth-ui)   | Higher-level components built on `shadcn-ui` — 60+ components across 8 categories, French / English labels, also served as a shadcn registry              |
| [`react-kit`](packages/react-kit)       | Hooks and headless components (`useKeyListener`, `usePersistentState`, `useControllableState`, `Show`, `Repeat`, `FocusOnMount`, `JsonLd`…)               |
| [`r2`](packages/r2)                     | Direct browser uploads to Cloudflare R2 / S3 through presigned URLs, with a hardened presign route handler (`Request` → `Response`, e.g. a Next.js route) |

### React Native / Expo (Android)

| Package                                                       | Description                                                                                                                                                                                                    |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`react-native-kit`](packages/react-native-kit)               | Components, hooks and helpers shared by the apps: forms, pickers, bottom sheet, toasts, swipeable rows, settings screens, theme, files, calendar, haptics — French / English labels, screenshots in its README |
| [`expo-backup`](packages/expo-backup)                         | Automatic Google Drive backup (private app folder), file export / import, restore with undo, optional or mandatory encryption with an app-generated key                                                        |
| [`expo-backup-ui`](packages/expo-backup-ui)                   | The "Settings ▸ Backup" screen and hooks for `expo-backup`                                                                                                                                                     |
| [`backup-crypto`](packages/backup-crypto)                     | XChaCha20-Poly1305 backup envelopes, keyrings and recovery codes — pure TypeScript, used by `expo-backup`                                                                                                      |
| [`expo-release-updates`](packages/expo-release-updates)       | In-app updates for sideloaded APKs from GitHub releases, with SHA-256 and origin checks                                                                                                                        |
| [`expo-release-updates-ui`](packages/expo-release-updates-ui) | Update banner, install progress card and release notes rendering                                                                                                                                               |
| [`expo-config-plugins`](packages/expo-config-plugins)         | Config plugins for sideloaded Android apps: release signing with your own key, ARM-only native code, short CMake paths on Windows, Kotlin JVM target, release-only permission removal                          |

### TypeScript

| Package                         | Description                                                                                                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`ts-kit`](packages/ts-kit)     | Framework-agnostic utilities: arrays, async (`retry`, `debounce`…), dates, CSV with formula neutralization, `parseUntrustedJson`, attempt limiter, pluralization… |
| [`ts-types`](packages/ts-types) | Generic utility types (`DeepPartial`, `Merge`, `NonEmptyArray`, `Brand`…), no runtime code                                                                        |

### Testing

| Package                                           | Description                                                                                                                |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [`test-kit`](packages/test-kit)                   | Framework-agnostic test helpers: in-memory file system, mock `fetch` responses, Zustand persisted state                    |
| [`expo-test-kit`](packages/expo-test-kit)         | Expo test helpers: fake `expo-file-system`, real SQLite + Drizzle test databases, full-app Expo Router rendering           |
| [`supabase-test-kit`](packages/supabase-test-kit) | Supabase integration testing: local clients and throwaway users, RLS security suite, schema drift and type generation CLIs |

### Tooling

| Package                                           | Description                                                                                |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`eslint-config`](packages/eslint-config)         | Shared ESLint flat configs (base, React, React Native / Expo, Next.js, Angular, Storybook) |
| [`typescript-config`](packages/typescript-config) | Shared `tsconfig.json` bases                                                               |

### Apps (not published)

| App                                  | Description                                                                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [`apps/web`](apps/web)               | Next.js showcase app                                                                                                                     |
| [`apps/shadweb`](apps/shadweb)       | Fictional dashboard proving `shadcn-ui` works as an installed dependency; also serves the `forth-ui` shadcn registry                     |
| [`apps/react-sb`](apps/react-sb)     | Storybook documenting and testing every web component                                                                                    |
| [`apps/rn-gallery`](apps/rn-gallery) | `react-native-kit` components rendered with react-native-web, to screenshot them for its README (`pnpm --filter rn-gallery screenshots`) |

Each package README documents its API with examples; every export also carries a JSDoc (hover it in your editor).

## Getting started

```bash
pnpm install
pnpm run dev:web    # Next.js app on localhost:3000
pnpm run dev:sb     # Storybook on localhost:6006
```

## Common commands

Run against the whole monorepo (via Turborepo, cached):

```bash
pnpm run build          # build all apps/packages
pnpm run dev            # dev mode for every app/package at once
pnpm run lint           # eslint everywhere
pnpm run check-types    # tsc --noEmit everywhere
pnpm run test           # vitest everywhere
pnpm run coverage       # tests with coverage thresholds
pnpm run size           # bundle size budgets (size-limit)
pnpm run format         # prettier --write
pnpm run format:check   # prettier --check
pnpm run clean          # clean build artifacts everywhere
```

Before pushing, run the same checks as the CI without Turborepo's cache, which can hide a failure:

```bash
CI=true pnpm exec turbo run build lint check-types test size --force
pnpm run format:check
```

To work on a single app/package instead of everything:

```bash
pnpm run dev:web                    # apps/web
pnpm run dev:shadweb                # apps/shadweb
pnpm run dev:sb                     # apps/react-sb
pnpm run dev:forth-ui               # packages/react/forth-ui
pnpm run dev:react-kit              # packages/react-kit
pnpm run dev:ts-kit                 # packages/ts-kit
pnpm run dev:ts-types               # packages/ts-types
pnpm run dev:eslint-config          # packages/eslint-config
pnpm run dev:expo-release-updates   # packages/expo-release-updates
```

For anything not listed above, filter directly:

```bash
turbo run <task> --filter=<package-name>
pnpm -F "*<package-name>" <task>
```

Packages are built to `dist/` (`tsc`, plus a Tailwind CSS build for the two with styles): run their `dev` / `build` script (or the whole repo's) after source changes for consumers, including the apps of this monorepo, to pick them up. After any change in `packages/react/forth-ui/src`, regenerate the shadcn registry (`registry:generate` in `apps/shadweb`) and commit it: the CI checks it is up to date.

## Releasing

Versions are managed with [Changesets](https://github.com/changesets/changesets):

1. Add a changeset to the pull request that changes a package (`pnpm changeset`).
2. Once merged, the Release workflow opens (or updates) a "Version Packages" pull request bumping versions and changelogs.
3. Merging it runs `scripts/publish.mjs`, which **stages** each new version on npm: the CI token can't publish on its own, a maintainer approves each version with 2FA (npmjs.com ▸ Staged Packages, or `npm stage approve <id> --otp <code>`). A leaked token can't ship a malicious version.

## Tooling

- [TypeScript](https://www.typescriptlang.org/) — shared bases in `packages/typescript-config`
- [ESLint](https://eslint.org/) — flat config, typed linting, shared bases in `packages/eslint-config`
- [Prettier](https://prettier.io) — formatting, with the Tailwind class sorting plugin
- [Vitest](https://vitest.dev/) — unit/component tests (browser mode for Storybook stories, jsdom mode for hooks/lib)
- [size-limit](https://github.com/ai/size-limit) — bundle size budgets of the published packages
- [lefthook](https://github.com/evilmartians/lefthook) — git hooks (`pnpm run prepare` installs them)
- [Renovate](https://docs.renovatebot.com/) — grouped dependency update PRs; Dependabot keeps the SHA-pinned GitHub Actions up to date, monthly
- [Turborepo](https://turborepo.com/) — task orchestration and caching

## Further reading

- [`UPGRADE.md`](UPGRADE.md) — running backlog of fixes, known debt, and upgrade history for this repo
- [`.doc/`](.doc) — additional notes (dev commands, linter setup, Storybook + Tailwind integration, themes, branching)

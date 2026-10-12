# @forthtilliath/eslint-config

Shared ESLint flat configs (`eslint.config.js`/`.ts`) — for every package/app
in this monorepo, and for any other project that wants the same setup via a
single import instead of hand-assembling a dozen plugins. Built on
`typescript-eslint`'s `strictTypeChecked` + `stylisticTypeChecked` presets,
with import sorting, Turborepo's own lint plugin, and Prettier
conflict-resolution baked in.

## Install

```bash
npm install --save-dev @forthtilliath/eslint-config eslint typescript
```

Or, from within this monorepo, as a workspace dependency:

```json
{
  "devDependencies": {
    "@forthtilliath/eslint-config": "workspace:*"
  }
}
```

`eslint` and `typescript` are peer dependencies — install them yourself (any
recent flat-config-era ESLint 9+/10+, and TypeScript 5+). Only what the base
config needs (`typescript-eslint`, `@eslint/js`, `globals`, import sorting,
Prettier conflict-resolution) ships as a regular dependency: every other
plugin is an **optional peer dependency**, installed by the project only for
the variant and options it actually uses. A React Native app doesn't get
`angular-eslint` (and the Angular CLI it pulls in), nor a TypeScript library
every React plugin.

| Variant / option        | Also install                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `.` (base)              | —                                                                                                         |
| `/react`                | `@eslint-react/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh`   |
| `/react-native`         | the `/react` list + `eslint-plugin-react-native`                                                          |
| `/nextjs`               | the `/react` list + `@next/eslint-plugin-next`                                                            |
| `/storybook`            | the `/react` list + `eslint-plugin-storybook`                                                             |
| `/angular`              | `angular-eslint`                                                                                          |
| `turbo: true` (default) | `eslint-plugin-turbo` — or pass `turbo: false` outside a Turborepo                                        |
| `a11y: true`\*          | `eslint-plugin-jsx-a11y` — \*default for `/react`, `/nextjs`, `/storybook`; pass `a11y: false` to skip it |
| `i18n: true`            | `eslint-plugin-i18next`                                                                                   |
| `testingLibrary: true`  | `eslint-plugin-testing-library eslint-plugin-jest-dom`                                                    |

```bash
# e.g. a standalone React Native / Expo app, with createReactNativeConfig({ turbo: false })
npm install --save-dev @forthtilliath/eslint-config eslint typescript \
  @eslint-react/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks \
  eslint-plugin-react-refresh eslint-plugin-react-native
```

A missing plugin fails with an explicit error naming the package to install
(or the option to turn off) as soon as ESLint loads the config.

**ESLint 10:** `eslint-plugin-react` and `eslint-plugin-react-native` still
declare `eslint` up to 9 only, so npm refuses to install them next to ESLint
10 (`ERESOLVE`). They work under ESLint 10 (see the `react-native` rules
below for the exceptions), so tell npm to accept it in the app's
`package.json`:

```json
{
  "overrides": {
    "eslint-plugin-react": { "eslint": "$eslint" },
    "eslint-plugin-react-native": { "eslint": "$eslint" }
  }
}
```

## Usage

Quick reference — pick the row matching the package, in its `eslint.config.ts`:

| Variant             | Subpath         | Use for                    | Extends       |
| ------------------- | --------------- | -------------------------- | ------------- |
| `baseConfig`        | `.` (root)      | A plain TypeScript library | —             |
| `reactConfig`       | `/react`        | A React library            | `baseConfig`  |
| `nextJsConfig`      | `/nextjs`       | A Next.js app              | `reactConfig` |
| `storybookConfig`   | `/storybook`    | A Storybook app            | `reactConfig` |
| `reactNativeConfig` | `/react-native` | A React Native / Expo app  | `reactConfig` |
| `angularConfig`     | `/angular`      | An Angular app/library     | `baseConfig`  |

Pick the variant that matches the package, in its `eslint.config.ts`:

```ts
// A plain TypeScript library (packages/lib, packages/types)
import { baseConfig } from "@forthtilliath/eslint-config";
export default baseConfig;
```

```ts
// A React library (packages/react/*)
import { reactConfig } from "@forthtilliath/eslint-config/react";
export default reactConfig;
```

```ts
// A Next.js app (apps/web)
import { nextJsConfig } from "@forthtilliath/eslint-config/nextjs";
export default nextJsConfig;
```

```ts
// A Storybook app (apps/react-sb)
import { storybookConfig } from "@forthtilliath/eslint-config/storybook";
export default storybookConfig;
```

```ts
// An Angular app/library
import { angularConfig } from "@forthtilliath/eslint-config/angular";
export default angularConfig;
```

```ts
// A React Native / Expo app
import { reactNativeConfig } from "@forthtilliath/eslint-config/react-native";
export default reactNativeConfig;
```

All six are **named** exports — a default import (`import config from "..."`)
resolves to the whole module namespace object instead of the config array and
crashes ESLint's flat-config loader outright. Two of the five variants had
exactly this bug at one point; use the named-import form above.

Each variant is additive: `reactConfig`/`angularConfig` extend `baseConfig`,
`nextJsConfig`/`storybookConfig`/`reactNativeConfig` extend `reactConfig`.

### Customizing a variant

Each variant is also exported as a factory (`createBaseConfig`,
`createReactConfig`, `createNextJsConfig`, `createStorybookConfig`,
`createAngularConfig`, `createReactNativeConfig`) taking an options object — the plain `baseConfig`,
`reactConfig`, etc. exports above are just that factory called with no
arguments. Pass options to opt out of a default:

```ts
// Turn off Prettier conflict-resolution (e.g. the project doesn't use Prettier)
import { createReactConfig } from "@forthtilliath/eslint-config/react";
export default createReactConfig({ prettier: false });
```

```ts
// Fall back to typescript-eslint's `recommended` preset instead of
// `strictTypeChecked`/`stylisticTypeChecked` (e.g. while migrating an
// existing codebase), and skip the Turborepo-only rule outside a Turborepo.
import { createBaseConfig } from "@forthtilliath/eslint-config";
export default createBaseConfig({ strict: false, turbo: false });
```

| Option           | Default  | Effect                                                                                                                                                                                                   |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prettier`       | `true`   | Append `eslint-config-prettier` at the end.                                                                                                                                                              |
| `strict`         | `true`   | Use `strictTypeChecked`/`stylisticTypeChecked` instead of plain `recommended`.                                                                                                                           |
| `turbo`          | `true`   | Enable `eslint-plugin-turbo`'s `no-undeclared-env-vars` rule.                                                                                                                                            |
| `snakeCase`      | `false`  | Also accept `snake_case` variable names in `@typescript-eslint/naming-convention` (e.g. rows destructured straight from a Supabase/SQL database).                                                        |
| `a11y`           | `true`\* | _(react/nextjs/storybook/react-native)_ Enable `eslint-plugin-jsx-a11y`'s recommended rules. \*Defaults to `false` in `createReactNativeConfig` (jsx-a11y targets DOM semantics, which RN doesn't have). |
| `i18n`           | `false`  | _(react/nextjs/storybook/react-native)_ Enable `eslint-plugin-i18next`'s `no-literal-string` rule.                                                                                                       |
| `testingLibrary` | `false`  | _(react/nextjs/storybook/react-native)_ Enable `eslint-plugin-testing-library` + `eslint-plugin-jest-dom` on test files.                                                                                 |

Options are forwarded down the chain, so `createNextJsConfig({ prettier: false })`
also disables Prettier in the `reactConfig`/`baseConfig` layers it builds on.

`createReactNativeConfig` also always adds `eslint-plugin-react-native`'s
`no-raw-text` rule and the RN/Metro-injected `__DEV__` global — these aren't
behind an option, unlike the toggles above. Every other rule of the plugin
stays off: `no-inline-styles`/`sort-styles` are stylistic rather than
correctness checks, and `no-unused-styles`, `no-single-element-style-arrays`,
`split-platform-components`, and `no-color-literals` all crash outright under
ESLint 10 — `eslint-plugin-react-native@5.0.0` still calls
`context.getSourceCode()`/`context.getFilename()`, APIs ESLint 10 removed.
`no-raw-text` is the only one that doesn't. Re-enable the others once the
plugin ships a fix.

```ts
// Full i18n project (next-intl, react-intl...): forbid hardcoded JSX strings
import { createNextJsConfig } from "@forthtilliath/eslint-config/nextjs";
export default createNextJsConfig({ i18n: true });
```

```ts
// React Native / Expo, customized: same options as createReactConfig, plus
// eslint-plugin-react-native's rules (a11y is off by default here, since
// jsx-a11y targets DOM semantics and doesn't apply to RN)
import { createReactNativeConfig } from "@forthtilliath/eslint-config/react-native";
export default createReactNativeConfig({ testingLibrary: true });
```

### Typed linting and non-project files

Rules that need type information (`consistent-type-exports`,
`naming-convention`, etc.) are scoped to `**/*.{ts,tsx,mts,cts}` only, and
`eslint.config.js`/`.ts`, `storybook-static/**` and `dist/**` are excluded
from linting entirely — none of them belong to a package's own `tsconfig`
project, so type-aware rules crash on them otherwise.

### Angular import order

`angularConfig` overrides `simple-import-sort/imports` on `**/*.ts` so
`@angular/core`/`rxjs` sort before every other package, ahead of the generic
"third-party packages, alphabetically" group `baseConfig` uses everywhere
else — the conventional Angular reading order (framework, then everything
else, then app code).

## Testing this package

Unlike the other five variants — each already exercised by whatever
package/app in this monorepo lints under them — `angularConfig` has no real
consumer here yet, so `src/angular.test.js` lints small fixture files under
`src/__fixtures__/angular/` through ESLint's Node API directly, standing in
for that. Extend it (or add a sibling `<variant>.test.js`) whenever a variant
changes without a real consumer to catch a regression.

`src/package.test.js` guards the dependency layout: any plugin imported
outside the base config must stay an optional peer dependency, never a
regular one.

## Scripts

```bash
pnpm run build        # tsc -> dist/ (consumers import the built output)
pnpm run dev           # tsc --watch
pnpm run check-types   # tsc --noEmit
pnpm run lint          # eslint (lints its own src/)
pnpm run test          # vitest run
pnpm run test:watch    # vitest
```

Run `pnpm run build` after editing `src/*.js` — consuming packages resolve
`@forthtilliath/eslint-config/*` to `dist/*.js`, not the source.

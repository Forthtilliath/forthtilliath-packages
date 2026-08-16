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
recent flat-config-era ESLint 9+/10+, and TypeScript 5+). Every ESLint plugin
each variant actually uses (`typescript-eslint`, `eslint-plugin-react`,
`angular-eslint`, etc.) ships as a regular dependency of this package, so
there's nothing else to install per variant.

## Usage

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

All five are **named** exports — a default import (`import config from "..."`)
resolves to the whole module namespace object instead of the config array and
crashes ESLint's flat-config loader outright. Two of the five variants had
exactly this bug at one point; use the named-import form above.

Each variant is additive: `reactConfig`/`angularConfig` extend `baseConfig`,
`nextJsConfig`/`storybookConfig` extend `reactConfig`.

### Typed linting and non-project files

Rules that need type information (`consistent-type-exports`,
`naming-convention`, etc.) are scoped to `**/*.{ts,tsx,mts,cts}` only, and
`eslint.config.js`/`.ts`, `storybook-static/**` and `dist/**` are excluded
from linting entirely — none of them belong to a package's own `tsconfig`
project, so type-aware rules crash on them otherwise.

## Scripts

```bash
pnpm run build        # tsc -> dist/ (consumers import the built output)
pnpm run dev           # tsc --watch
pnpm run check-types   # tsc --noEmit
pnpm run lint          # eslint (lints its own src/)
```

Run `pnpm run build` after editing `src/*.js` — consuming packages resolve
`@forthtilliath/eslint-config/*` to `dist/*.js`, not the source.

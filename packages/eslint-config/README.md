# @forthtilliath/eslint-config

Shared ESLint flat configs (`eslint.config.js`/`.ts`) for every package/app in
this monorepo. Built on `typescript-eslint`'s `strictTypeChecked` +
`stylisticTypeChecked` presets, with import sorting, Turborepo's own lint
plugin, and Prettier conflict-resolution baked in.

## Install

```json
{
  "devDependencies": {
    "@forthtilliath/eslint-config": "workspace:*"
  }
}
```

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

All four are **named** exports — a default import (`import config from "..."`)
resolves to the whole module namespace object instead of the config array and
crashes ESLint's flat-config loader outright. Two of the four variants had
exactly this bug at one point; use the named-import form above.

Each variant is additive: `reactConfig` extends `baseConfig`,
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

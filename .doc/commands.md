# Dev commands

Raccourcis définis à la racine (`package.json`) — toujours préfixer par `corepack`
tant que le pnpm global de la machine est cassé (`corepack pnpm run <script>`).

```bash
pnpm run dev:web           # apps/web (Next.js)
pnpm run dev:sb             # apps/react-sb (Storybook)
pnpm run dev:forth-ui       # packages/react/forth-ui (tsc --watch + tailwind --watch)
pnpm run dev:react-ui       # packages/react/ui (tsup --watch)
pnpm run dev:lib            # packages/lib (tsc --watch)
pnpm run dev:types          # packages/types (tsc --watch)
pnpm run dev:eslint-config  # packages/eslint-config (tsc --watch)
pnpm run build:forth-ui     # build ponctuel de packages/react/forth-ui
```

`@forthtilliath/shadcn-ui` et `@forthtilliath/react-hooks` n'ont pas de script
`dev`/`build` : leurs `exports` pointent directement vers `src/*.ts(x)`, consommé
tel quel par Vite/Storybook sans étape de build.

Pour un package non listé ci-dessus, filtrer directement avec turbo ou pnpm :

```bash
turbo run <task> --filter=<nom-du-package>
pnpm -F "*<nom-du-package>" <task>
```

# Build commands

```bash
pnpm run build      # build complet du monorepo (turbo, avec cache)
pnpm run build:forth-ui
```

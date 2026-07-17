# ESLint

Setup réel dans `packages/eslint-config/src/`. Flat config
(`eslint.config.ts`), pas de `.eslintrc`. Chaque app/package importe l'un
de ces 4 presets et les étend au besoin dans son propre `eslint.config.ts`.

## Presets

| Fichier        | Étend      | Pour                                          |
| -------------- | ---------- | --------------------------------------------- |
| `base.js`      | —          | Tout package TS pur (pas de React)            |
| `react.js`     | `base.js`  | Packages/apps React (Vite, packages internes) |
| `nextjs.js`    | `react.js` | Apps Next.js                                  |
| `storybook.js` | `react.js` | `apps/react-sb` (règles Storybook en plus)    |

## Ce qui est activé (`base.js`)

- `typescript-eslint` **strict-type-checked** + **stylistic-type-checked**
  (pas juste `recommended`) — nécessite `parserOptions.projectService`.
- `eslint-plugin-simple-import-sort` — ordre d'imports auto-fixable
  (`--fix` corrige, ne pas trier à la main).
- `eslint-plugin-turbo` — détecte les env vars non déclarées dans
  `turbo.json`.
- `@typescript-eslint/consistent-type-imports` /
  `consistent-type-exports` — `import type`/`export type` obligatoires.
- `@typescript-eslint/naming-convention` — camelCase pour variables/
  fonctions, PascalCase pour les types ; les `const` locales tolèrent
  aussi `UPPER_CASE` (et `PascalCase` dans `react.js`, pour les refs de
  composants et les objets `Context`). `leadingUnderscore: "allow"`
  partout (variables `_ignorées` volontairement).
- `**/*.js` désactive les règles type-checked (pas de `tsconfig` pour les
  fichiers JS).

## En plus dans `react.js`

- `@eslint-react/eslint-plugin` en mode **recommended-type-checked**.
- `eslint-plugin-react-hooks` — inclut les règles "React Compiler"
  (`set-state-in-effect`, `refs`, `purity`, `incompatible-library`,
  `preserve-manual-memoization`), pas seulement `rules-of-hooks`/
  `exhaustive-deps`.
- `eslint-plugin-react-refresh` — `only-export-components` en erreur
  (désactivé au cas par cas via override de package quand un fichier
  co-locale volontairement un export non-composant, ex. `buttonVariants`
  à côté de `Button`).
- `restrict-template-expressions` et `no-unsafe-call` en **warn** (pas
  error) ici — plus permissif que `base.js` pour absorber le typing
  parfois lâche de certaines libs React tierces.

## Cas récurrents rencontrés en pratique

- **`Linter.Config[]` explicite dans `eslint.config.ts`** : dès qu'un
  fichier fait `export default [...preset, { ...override }]` (spread +
  objet inline) dans un package avec `declaration: true`, TS peut
  échouer avec `TS2742` ("inferred type... cannot be named") — le type
  inféré référence un type interne non exporté de `@eslint/core`.
  Fix : annoter explicitement `const config: Linter.Config[] = [...]`
  plutôt que compter sur l'inférence. `apps/web`/`apps/shadweb`
  n'y sont pas exposés (leur tsconfig a `noEmit: true`, qui désactive ce
  diagnostic) ; les packages qui émettent des déclarations (`shadcn-ui`,
  `apps/react-sb`) si.
- **`no-array-index-key`** : à désactiver par fichier (pas globalement)
  pour les listes statiques jamais réordonnées (placeholders comptés,
  `Array.from({length: n})`) — voir les overrides dans
  `apps/react-sb/eslint.config.ts` et
  `packages/react/shadcn-ui/eslint.config.ts`.

## Historique de session

Une passe de nettoyage lint complète (226 erreurs/warnings → 0 sur tout
le monorepo) a eu lieu — voir `git log` pour les commits détaillés
(root-cause fixes, pas de suppressions en masse). `UPGRADE.md` ne liste
plus de dette lint : elle est résolue.

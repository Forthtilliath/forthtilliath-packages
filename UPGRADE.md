# Backlog d'améliorations

État des lieux du monorepo au 2026-07-15 (branche `dev-tw-sb`). Liste non ordonnée par priorité stricte, à trier selon les besoins.

## Corrigé lors de cette session (vérification `lint`/`check-types`/`build`)

- **`apps/web` ne buildait plus du tout** : [apps/web/app/layout.tsx](apps/web/app/layout.tsx) importait `@forthtilliath/shadcn-ui/globals.css` et `@forthtilliath/shadcn-ui/themes/twitter.css`, des chemins absents du champ `exports` du package (qui n'expose que `./styles/*.css`). `next build` échouait avec `Module not found`. Corrigé en préfixant les deux imports par `styles/`.
- **Le lint plantait (crash, pas juste des erreurs)** sur `@forthtilliath/eslint-config`, `@forthtilliath/types` et `@forthtilliath/forth-ui` : dans [packages/eslint-config/src/base.js](packages/eslint-config/src/base.js), un bloc de règles typées (`consistent-type-exports`, `naming-convention`, etc.) sans restriction `files` réactivait le typed-linting sur des `.js`/`.ts` explicitement exclus juste au-dessus par `disableTypeChecked`, ou jamais inclus dans un `tsconfig.json` (les `eslint.config.*` eux-mêmes). Corrigé en scopant ce bloc à `**/*.{ts,tsx,mts,cts}` et en ignorant les fichiers `eslint.config.js`/`eslint.config.ts`. Le fix nécessite de rebuild `packages/eslint-config` (`pnpm --filter @forthtilliath/eslint-config build`) pour se propager aux packages consommateurs.
- `storybook-static/` n'était pas dans `.gitignore` (généré lors du test de `build-storybook`, qui passe correctement).

## Lint : dette réelle restante (non traitée, hors scope d'une simple vérification)

Après les deux fixes ci-dessus, `pnpm lint` échoue encore sur de vraies erreurs de style (plus de crash) :

- `@forthtilliath/types` : 5 erreurs `consistent-type-exports` (`export type` manquant dans `src/index.ts`, `src/array/index.ts`, `src/helpers/index.ts`) — fix mécanique rapide.
- `@forthtilliath/shadcn-ui` : **215 erreurs et 109 warnings** répartis sur la majorité des composants (`consistent-type-imports`, `naming-convention` sur des variables PascalCase/UPPER_CASE issues du code généré shadcn, `no-unsafe-*` concentrées dans `calendar-date-picker.tsx`, `no-unnecessary-condition`, etc.). Volume important : soit la config de règles est trop stricte pour du code généré par la CLI shadcn (auquel cas certaines règles méritent des exceptions ciblées), soit c'est de la dette accumulée à traiter en plusieurs passes.
- `react-sb` : 3 erreurs (naming-convention, `no-unnecessary-condition`) + 7 warnings mineurs.

`pnpm check-types` et `pnpm build` sont **100% verts** sur les packages qui ont ces scripts (voir section suivante pour la couverture).

## CI / qualité — traité dans une session ultérieure (2026-07-15, même jour)

Tous les points listés dans la section originale ci-dessous ont été traités :

- **CI ajoutée** : [.github/workflows/ci.yml](.github/workflows/ci.yml) tourne sur chaque push `main`/PR — install, `format:check`, `lint`, `check-types`, `build`, `test` (avec install du binaire Playwright chromium).
- **Tests ajoutés** : `@forthtilliath/lib` (32 tests, vitest), `@forthtilliath/react-hooks` (13 tests, vitest + `@testing-library/react`), et `apps/react-sb` (297 tests sur 65 fichiers de stories, via `@storybook/addon-vitest` en mode navigateur réel/Playwright/chromium headless — chaque story est maintenant smoke-testée, et les `play` functions déjà écrites avec `tags: ["!dev", "!autodocs"]` (accordion, calendar, sonner, alert-dialog) s'exécutent enfin comme de vrais tests plutôt que d'être juste regardées manuellement). Nouvelle tâche `turbo run test` (`dependsOn: ["^build"]`, nécessaire car `forth-ui` s'importe depuis son `dist/`).
- **Husky/lint-staged → lefthook** : un hook `pre-commit` pointait déjà vers `lefthook` dans `.git/hooks/` mais la dépendance/config n'existaient pas, donc il ne faisait rien (`Can't find lefthook in PATH` silencieux). Complété : `lefthook.yml` (formatte les fichiers stagés via `prettier --write`), dépendance ajoutée, `"prepare": "lefthook install"` pour que ça s'auto-active pour tout contributeur. **Ne lance pas `eslint`** en pre-commit — `shadcn-ui` a 215 erreurs pré-existantes, ça bloquerait tout commit touchant ce package tant que cette dette n'est pas traitée séparément.
- **`.prettierrc`/`.prettierignore` ajoutés**, et tout le repo reformaté (57 fichiers, essentiellement tabs→2-espaces).
- **Renovate ajouté** ([renovate.json](renovate.json)) : `config:recommended` + groupement des devDependencies mineures/patch + approbation manuelle pour les majeures des frameworks clés (next/react/typescript/tailwindcss).

Bugs réels trouvés en cours de route : `packages/lib`'s `tsc` build compilait les fichiers `*.test.ts` directement dans `dist/` (tsconfig ne les excluait pas) ; l'`alert-dialog.stories.tsx`'s `play` function cherchait un bouton "Open" copié-collé d'un autre composant alors que celui-ci dit "Show Dialog" — jamais détecté avant puisque personne n'exécutait ces `play` functions comme de vrais tests ; lint plantait à nouveau (même bug de fond que le fix eslint-config du dessus) dès que `storybook-static/` existait sur disque, car ESLint n'a aucun `tsconfig` pour du JS bundlé/minifié.

## Couverture `check-types` / `lint` incomplète — traité le 2026-07-16

`check-types` ajouté à `packages/lib`, `packages/react/forth-ui`, `packages/react/shadcn-ui`, `packages/react/hooks` et `apps/react-sb` (les 5 packages que turbo ignorait silencieusement faute de script). `lint` de `packages/lib` réparé au passage : son `eslint.config.ts` important `@forthtilliath/eslint-config/` (slash final, hors du champ `exports` du package) plantait avec `ERR_PACKAGE_PATH_NOT_EXPORTED` — jamais vu puisque le script `lint` n'existait pas du tout avant.

Deux découvertes en activant la couverture :

- Le `tsconfig.json` de `lib` excluait déjà `*.test.ts` (pour ne pas les livrer dans `dist/`), ce qui les cachait aussi du typed-linting et de `check-types`. Séparé en `tsconfig.json` (projet complet, utilisé par lint/check-types) + `tsconfig.build.json` (exclut les tests, utilisé uniquement par `build`/`dev`).
- `shadcn-ui` échoue maintenant `check-types` pour de vrai : `chart.tsx` et `form.tsx` ont des erreurs de types pré-existantes (generics recharts / react-hook-form+zod) — exactement les mêmes fichiers déjà signalés côté lint. Dette documentée, non traitée ici (voir section lint plus haut). Deux erreurs propres à `react-sb` que ça a révélées ont été corrigées directement (accès de tableau non gardé, prop `payload` marquée requise à tort sur `ChartLegendContent`).

`pnpm check-types` et `pnpm lint` à la racine couvrent maintenant vraiment tout le repo — les seuls échecs restants sont la dette de lint/types déjà documentée (`types`, `shadcn-ui`, `react-sb`), pas des trous de couverture.

## Documentation

- **`README.md` racine** toujours le boilerplate générique `create-turbo` (mentionne `docs`, `@repo/ui` — des packages qui n'existent pas dans ce repo). Ne décrit pas la structure réelle (react-sb, forth-ui vs shadcn-ui, lib, types, hooks).
- **`apps/react-sb/README.md`** toujours le boilerplate générique Vite + React.
- **Pas de README** pour `packages/react/forth-ui` ni `packages/react/shadcn-ui` — deux librairies de composants sans doc expliquant leur rôle respectif ni quand utiliser l'une plutôt que l'autre.
- **`.doc/`** est une bonne base de notes personnelles (`branches.md`, `more-components.md`, `more-themes.md`, `linter.md`, `shadcn/list-components.md`) mais reste un fourre-tout de liens, pas une doc d'onboarding. Le contenu de `branches.md` (stratégie de branches) et `more-themes.md` (workflow tweakcn) mériterait d'être formalisé dans un vrai `CONTRIBUTING.md`.
- **Pas de `LICENSE`** à la racine alors que `packages/react/forth-ui/package.json` déclare `"license": "MIT"`.

## Sélecteur de thème (objectif produit non atteint)

- 10 fichiers thème prêts dans `packages/react/shadcn-ui/src/styles/themes/` (blue, bubblegum, claymorphism, default, green, orange, red, rose, twitter, violet, yellow), générés via tweakcn — mais [apps/web/app/layout.tsx](apps/web/app/layout.tsx) importe `styles/themes/twitter.css` en dur et force `className="dark"` sur `<html>`. Aucun sélecteur runtime.
- `next-themes` est une dépendance de `shadcn-ui` mais n'est utilisé que dans `sonner.tsx` (pour sa propre détection dark/light) — **aucun `ThemeProvider` ne wrap l'app**, donc le mécanisme de theming de `next-themes` n'est pas exploité côté `apps/web`.
- [apps/web/app/layout.tsx:10](apps/web/app/layout.tsx#L10) contient un import mort commenté (`// import "./globals.css"`) à nettoyer.

## Housekeeping

- Trois packages de composants React aux noms proches (`@forthtilliath/react-ui`, `@forthtilliath/forth-ui`, `@forthtilliath/shadcn-ui`) : le périmètre de chacun n'est pas documenté (cf. point doc ci-dessus), source de confusion pour choisir où ajouter un composant.
- `engines.node` racine toujours `">=18"` alors que le repo tourne sur Next 15 / React 19 / Tailwind 4 — à vérifier/relever si la version minimale réellement testée est plus récente.

## Montées de version majeures — traitées le 2026-07-16

Toutes tentées une par une, vérifiées (lint/check-types/build/test) après chacune, committées séparément :

- **Faites** : `lucide-react` 0→1, `react-resizable-panels` 3→4 (réécriture du wrapper `resizable.tsx`, exports/props renommés), `react-day-picker` 9→10 (`classNames.table` → `month_grid`), `concurrently` 9→10, `@types/node` 24→26, tout l'écosystème ESLint (`eslint` 9→10, `@eslint-react/eslint-plugin` 1→5, `@next/eslint-plugin-next` 15→16, etc.), **Next.js 15→16**.
- **Abandonnée** : Storybook 9→10 (avec Vite 8/Vitest 4, qui en dépendent). Bug de packaging amont dans `storybook@10.5.0` : `@storybook/addon-vitest` injecte une condition de résolution `"storybook"` que le propre champ `exports` du package `storybook` ne supporte pas pour `./internal/test` — casse ~36-46 tests de façon déterministe. Pas un problème côté config de ce repo. Revert propre effectué, repo revenu à Storybook 9.1.20 / Vite 7 / Vitest 3, 297/297 tests toujours verts. À retenter quand un patch Storybook sort.
- **Non tentée** : TypeScript 7 (saute la v6 entière, réécriture native/Go du compilateur). Pas d'API de compilateur stable avant la 7.1 (~3-4 mois) : casserait `typescript-eslint` (aucune règle typée ne pourrait tourner) et `tsup --dts` (build de `@forthtilliath/react-ui`) dans tout le monorepo. À réévaluer quand 7.1 sort.

Bugs réels trouvés en cours de route (au-delà des simples bumps de version) :

- `apps/web/eslint.config.ts` important `@forthtilliath/eslint-config/nextjs` en `import default` alors que ce module n'a qu'un export nommé (`nextJsConfig`) — cassé depuis toujours, masqué par `next lint` (retiré dans Next 16, d'où la découverte).
- `nextjs.js` et `react.js` utilisaient `settings: { react: { version: "detect" } }`, qui route vers du code d'`eslint-plugin-react` appelant l'API dépréciée `context.getFilename()` — supprimée par ESLint 10, crash immédiat. Épinglé à une version explicite (`"19"`).
- `nextjs.js` n'excluait ni `.next/**` ni `next-env.d.ts` du lint (géré avant par le wrapper `next lint`), et n'autorisait pas le PascalCase pour les fonctions (contrairement à `react.js`) — donc `apps/web` n'avait probablement jamais été vraiment linté correctement avec ce config partagé avant cette session.
- `apps/web/app/table/data-table.tsx` : doublon mort du bloc `DataTable` réellement utilisé, supprimé.
- `chart.stories.tsx` : un `useMemo` dans une fonction `render` de story déclenchait la règle `rules-of-hooks` mise à jour d'`@eslint-react/eslint-plugin` v5 — mémoisation inutile d'un tableau statique de toute façon, déplacée au niveau module.
- `select.stories.tsx` : le test `ShouldSelectOption` (jamais exécuté avant l'intégration Vitest de tout à l'heure) échouait de façon déterministe à cause du timing d'animation `pointer-events: none` de Radix Select, révélé par la mise à jour de `@radix-ui/react-select` — corrigé via `fireEvent` au lieu de `userEvent`.

`engines.node` racine (`>=18`) est maintenant clairement obsolète : Next 16 exige Node 20.9+.

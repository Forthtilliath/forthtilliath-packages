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

## Couverture `check-types` / `lint` incomplète

`turbo.json` déclare les tâches `check-types` et `lint` avec `dependsOn: ["^check-types"]` / `["^lint"]`, mais turbo **ignore silencieusement** les packages sans le script correspondant :

- Pas de script `check-types` dans : `packages/lib`, `packages/react/forth-ui`, `packages/react/shadcn-ui`, `packages/react/hooks`, `apps/react-sb`. Les deux vraies librairies de composants (`forth-ui`, `shadcn-ui`) ne sont donc **jamais typecheckées** par `pnpm check-types` — seul `pnpm build` (via `tsc`) le fait indirectement pour `forth-ui`.
- Pas de script `lint` dans `packages/lib`.

À homogénéiser pour que `pnpm check-types` et `pnpm lint` à la racine couvrent vraiment tout le repo.

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

## Non traité volontairement

- Montées de version majeures de dépendances : à évaluer au cas par cas (breaking changes), pas dans ce backlog.

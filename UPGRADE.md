# Backlog

Ce qu'il reste réellement à faire sur ce repo (branche `dev-tw-sb`). Pour
l'historique des sessions précédentes (bugs corrigés, montées de version
déjà faites, etc.), voir `git log`.

## Lint — dette de style (pas de crash, juste des erreurs de règles)

- `packages/types` : 5 erreurs `consistent-type-exports` (`export type`
  manquant dans `src/index.ts`, `src/array/index.ts`, `src/helpers/index.ts`).
  Fix mécanique rapide.
- `packages/react/shadcn-ui` : **215 erreurs + 109 warnings**, réparties sur
  la majorité des composants générés par la CLI shadcn
  (`consistent-type-imports`, `naming-convention` sur des variables
  PascalCase/UPPER_CASE issues du code généré, `no-unsafe-*` concentrées
  dans `calendar-date-picker.tsx`, `no-unnecessary-condition`). Soit
  assouplir la config pour ce code généré, soit traiter en plusieurs passes.
- `apps/react-sb` : 3 erreurs (`naming-convention`, `no-unnecessary-condition`)
  - 7 warnings mineurs.

## check-types — même dette, mêmes fichiers

- `packages/react/shadcn-ui` : `src/components/blocks/form.tsx` (generics
  `react-hook-form` + résolveur `zod` incompatibles) et
  `src/components/chart.tsx` (prop `payload` mal typée côté `recharts`).
  Erreurs pré-existantes, pas des régressions.

## Sélecteur de thème (non fait)

- 10 thèmes [tweakcn](https://tweakcn.com) prêts dans
  `packages/react/shadcn-ui/src/styles/themes/`, mais
  [apps/web/app/layout.tsx](apps/web/app/layout.tsx) importe
  `themes/twitter.css` en dur et force `className="dark"` sur `<html>`.
  Aucun sélecteur runtime.
- `next-themes` est disponible (dépendance de `shadcn-ui`) mais aucun
  `ThemeProvider` ne wrap `apps/web` — seul `sonner.tsx` l'utilise pour sa
  propre détection dark/light.
- Import mort commenté à nettoyer :
  [apps/web/app/layout.tsx:10](apps/web/app/layout.tsx#L10)
  (`// import "./globals.css"`).

## Housekeeping

- `.doc/` reste un fourre-tout de notes perso (`branches.md`,
  `more-components.md`, `more-themes.md`, `linter.md`), pas une doc
  d'onboarding. `branches.md` (stratégie de branches) et `more-themes.md`
  (workflow tweakcn) mériteraient un vrai `CONTRIBUTING.md`.
- Pas de `LICENSE` à la racine, alors que
  `packages/react/forth-ui/package.json` déclare `"license": "MIT"`.

## Montées de version en attente

- **Storybook 10** (+ Vite 8 / Vitest 4) : bloqué par un bug de packaging
  amont dans `storybook@10.5.0` (`@storybook/addon-vitest` casse la
  résolution `./internal/test`, ~36-46 tests cassés de façon déterministe).
  Pas un problème côté config de ce repo — à retenter quand un patch sort.
- **TypeScript 7** : pas d'API de compilateur stable avant la 7.1
  (~3-4 mois) — casserait `typescript-eslint` (règles typées) et
  `tsup --dts` (build de `@forthtilliath/react-ui`). À réévaluer à ce
  moment-là.

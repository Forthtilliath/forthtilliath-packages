# @forthtilliath/shadcn-ui

## 0.4.2

### Patch Changes

- 9926747: Dependencies moved to their latest minor versions: Radix UI primitives, lucide-react, shiki, react-hook-form, @hookform/resolvers, react-resizable-panels, tailwind-merge, input-otp and react-day-picker for the UI packages; globals and typescript-eslint for the ESLint config.

## 0.4.1

### Patch Changes

- 5c67142: Requires zod 4.6.7 or later: earlier 4.x versions can exhaust memory while validating oversized constrained collections (GHSA advisory, fixed in 4.6.6).

## 0.4.0

### Minor Changes

- 9539764: Add `styles/sources.css`, which registers the pre-built components with the consumer's Tailwind build (`@import "@forthtilliath/forth-ui/styles/sources.css";`). Its `@source` paths are relative to the package, so it works with any `node_modules` layout — the previously documented `@source "../node_modules/@forthtilliath/*/dist/**/*.js"` matched nothing under pnpm, leaving forth-ui components unstyled.

## 0.3.0

### Minor Changes

- f78098d: Eight new themes under `styles/themes/` that go well beyond a color swap: `brutalist`, `pixel`, `crt`, `synthwave`, `glass`, `sketch`, `newspaper`, `memphis`. Besides their own fonts, radius and shadows, each adds signature effects — plain CSS on shadcn's `data-slot` attributes (pixel frames, scanlines, perspective grid, frosted glass, hand-drawn outlines, double rules, confetti…), active only while the theme is imported; focus stays visible. Every text/background pair meets WCAG AA in light and dark mode. Fonts fall back to system stacks — load the ones named at the top of each file for the full look.

### Patch Changes

- c1bd669: Relative imports in the published ESM now carry their `.js` extension (`./slot-or-callback.js`, `../button/index.js`), so the packages load under plain Node ESM (Vitest with externalized deps, SSR scripts…) and not only through a bundler. These packages now type-check with `moduleResolution: NodeNext`, which enforces it — except `react-native-kit` and `expo-release-updates-ui` (only ever loaded through Metro, they keep `bundler` resolution) and `shadcn-ui`, whose sources are shadcn components kept as-is: its `dist/` gets the extensions added by a post-build step instead.
- 6289d93: Accessibility (WCAG AA, checked by axe on every Storybook story):

  - **Contrast** — solid `success`/`info` Alert and Badge use the -700 shade (white text), solid `warning` keeps amber with dark text, `destructive` soft uses the red palette; colored Alerts give their description their own text color; Avatar fallback colors set an explicit, readable text color (and `-full` ones a -800 / dark:-200 one); MultiStepLoader's upcoming steps are no longer faded. shadcn-ui's default theme `--muted-foreground` is slightly darker (0.545) to reach 4.5:1 on `--muted`.
  - **Names** — Combobox / MultiSelect triggers get an accessible name (`ariaLabel`, or the placeholder) and accept Field's `id` / `aria-describedby` / `aria-invalid`; TagsInput takes `id` / `ariaLabel`; ColorPicker's hex input is labelled; Progress is named by its `label`.
  - **Markup** — Breadcrumb no longer puts a `<span>` inside its `<ol>`; ScrollShadow is keyboard-focusable (so keyboard users can scroll it).
  - Badge / Alert: `look="outline"` no longer strips the background of the neutral variants.

- c512cde: Declare `react` (and `react-dom` for `forth-ui`/`shadcn-ui`) as peer dependencies instead of regular dependencies, so consumers never end up with a second copy of React ("Invalid hook call").
- c1bd669: Declare `sideEffects` (`false`, or `["*.css"]` for `forth-ui`/`shadcn-ui`) so bundlers can tree-shake unused modules, root barrels included. Internal dependencies are now published as caret ranges (`^0.4.0`) instead of exact versions.

## 0.2.0

### Minor Changes

- d756eb4: First public release. `@forthtilliath/forth-ui`, `@forthtilliath/shadcn-ui`, and `@forthtilliath/react-hooks` are now built to `dist/` and published to npm — no source-level changes to their components/hooks in this release.

# @forthtilliath/forth-ui

## 0.4.0

### Minor Changes

- fe4dfad: Leaner published stylesheet (`styles/globals.css`): it now covers forth-ui's components and only the shadcn-ui components they're built on (≈20 → 15 kB brotli), and no longer ships Storybook-only rules (the safelist and `.docs-story` styles). **If you import this file and also use other shadcn-ui components directly** (Sidebar, Table, Select…), switch to the Tailwind setup described under "Theming" in the README, which scans both packages.
- b8b5db2: Bilingual built-in labels (French / English):

  - **`locale` prop (`"fr" | "en"`)** on every component with built-in text, plus a **`UiLocaleProvider`** (new `@forthtilliath/forth-ui/locale` entry point, with `UI_MESSAGES` and `useUiLocale`) to set it once for a whole tree. A component's own `locale` wins; its text props (`placeholder`, `emptyMessage`, `ariaLabel`, `cancelLabel`/`confirmLabel`…) still override individual strings.
  - **Behavior change — French is now the default**, like `react-native-kit`: `aria-label`s ("Fermer", "Copier le code", "Chargement"…), default placeholders ("Sélectionner…", "Choisir une date"…), empty states ("Aucun résultat."), and the visible Pagination ("Précédent" / "Suivant") and ConfirmDialog ("Annuler" / "Continuer") buttons. Wrap the app in `<UiLocaleProvider locale="en">` to keep the previous English text.
  - `Spinner`, `Avatar` and `QrCode` are now client components (`"use client"`), to read the locale context.

- 238acaa: New components, moved up from the apps of this repo:

  - **`ModeToggle`** + **`ThemeProvider`** (`components/mode-toggle`) — a light / dark / system theme switcher (French / English labels) and next-themes' provider behind a `"use client"` boundary. `next-themes` is a new **optional** peer dependency, only needed for this entry point.
  - **`ThemeImage`** (`components/theme-image`) — an image with a light and a dark version, switched by the `dark` variant; `as={Image}` renders Next.js' `Image`.
  - **`CopyMenuItem`** (`components/copy-menu-item`) — a `DropdownMenuItem` that copies a value and briefly shows a checkmark, keeping the menu open.

### Patch Changes

- c1bd669: Relative imports in the published ESM now carry their `.js` extension (`./slot-or-callback.js`, `../button/index.js`), so the packages load under plain Node ESM (Vitest with externalized deps, SSR scripts…) and not only through a bundler. These packages now type-check with `moduleResolution: NodeNext`, which enforces it — except `react-native-kit` and `expo-release-updates-ui` (only ever loaded through Metro, they keep `bundler` resolution) and `shadcn-ui`, whose sources are shadcn components kept as-is: its `dist/` gets the extensions added by a post-build step instead.
- 6289d93: Accessibility (WCAG AA, checked by axe on every Storybook story):

  - **Contrast** — solid `success`/`info` Alert and Badge use the -700 shade (white text), solid `warning` keeps amber with dark text, `destructive` soft uses the red palette; colored Alerts give their description their own text color; Avatar fallback colors set an explicit, readable text color (and `-full` ones a -800 / dark:-200 one); MultiStepLoader's upcoming steps are no longer faded. shadcn-ui's default theme `--muted-foreground` is slightly darker (0.545) to reach 4.5:1 on `--muted`.
  - **Names** — Combobox / MultiSelect triggers get an accessible name (`ariaLabel`, or the placeholder) and accept Field's `id` / `aria-describedby` / `aria-invalid`; TagsInput takes `id` / `ariaLabel`; ColorPicker's hex input is labelled; Progress is named by its `label`.
  - **Markup** — Breadcrumb no longer puts a `<span>` inside its `<ol>`; ScrollShadow is keyboard-focusable (so keyboard users can scroll it).
  - Badge / Alert: `look="outline"` no longer strips the background of the neutral variants.

- 23e6db0: - **Accordion** — `hideChevron` now actually hides the chevron (it never did: the customized shadcn trigger rendered the default chevron instead). The trigger is built on the Radix primitive inside forth-ui, so the component also works with the upstream shadcn `accordion` (registry installs).
  - **Grid** — `ClassValue` comes from `clsx` rather than shadcn-ui's `lib/utils` (which upstream shadcn doesn't export it from).
  - Both are now published in the shadweb registry (`grid` was left out).
- 28b2278: `globals.css` now includes the classes used by the shadcn-ui components forth-ui builds on — notably tw-animate-css's `animate-in` / `animate-out` family, missing from every published version so far: Dialog, Sheet, Popover, Tooltip… had no enter/exit animation with forth-ui's CSS alone. The file grows accordingly (≈19 kB brotli, was ≈12 kB).
- 3e41c21: Found by the new Storybook interaction tests:

  - **Rating** — real keyboard support (WAI-ARIA radio group): arrows move the rating, Home/End jump to the ends, and the stars are a single Tab stop (roving tabindex) instead of one each.
  - **ConfirmDialog** — no longer renders an empty, unnamed dialog while animating out.
  - **Named dialogs** — the popovers of Combobox, MultiSelect, DatePicker and NotificationCenter, and Navbar's mobile menu (screen-reader-only title), now have an accessible name.

- c512cde: Move `@forthtilliath/ts-types` to `dependencies`: the published type declarations (`Grid`, `GridItem`) import it, so it was missing for consumers.
- c512cde: Declare `react` (and `react-dom` for `forth-ui`/`shadcn-ui`) as peer dependencies instead of regular dependencies, so consumers never end up with a second copy of React ("Invalid hook call").
- c1bd669: Declare `sideEffects` (`false`, or `["*.css"]` for `forth-ui`/`shadcn-ui`) so bundlers can tree-shake unused modules, root barrels included. Internal dependencies are now published as caret ranges (`^0.4.0`) instead of exact versions.
- ccdad7c: Add the missing `"use client"` directive to components relying on state, context or event handlers, so they can be rendered from a React Server Component: `Grid`/`GridItem` and `Pagination`.
- Updated dependencies [c1bd669]
- Updated dependencies [6289d93]
- Updated dependencies [1f11247]
- Updated dependencies [ccdad7c]
- Updated dependencies [c512cde]
- Updated dependencies [587ff55]
- Updated dependencies [c512cde]
- Updated dependencies [f78098d]
- Updated dependencies [c1bd669]
- Updated dependencies [47e6bae]
- Updated dependencies [c1bd669]
  - @forthtilliath/react-kit@0.5.0
  - @forthtilliath/shadcn-ui@0.3.0
  - @forthtilliath/ts-types@0.3.0

## 0.3.0

### Minor Changes

- 405dda7: Add `ToggleSwitch` (on/off switch with optional label and description, three sizes), `ColumnMenu` (show/hide and reorder a table's columns with dnd-kit, plus `useDndSensors`), `GradientFrame` (visual on an offset gradient frame) and `IconBubble` (icon in a tinted round bubble).

### Patch Changes

- f433475: `ColumnMenu`: add `badge`, `header`, `hint`, `list` and `row` to the `className` parts, so every area's default style can be overridden; rows carry `data-dragging` while dragged.

## 0.2.5

### Patch Changes

- Updated dependencies [f4e5779]
  - @forthtilliath/react-kit@0.4.0

## 0.2.4

### Patch Changes

- Updated dependencies [ca2e7c5]
  - @forthtilliath/react-kit@0.3.0

## 0.2.3

### Patch Changes

- Updated dependencies [df89512]
  - @forthtilliath/react-kit@0.2.1

## 0.2.2

### Patch Changes

- Updated dependencies [0b0c639]
  - @forthtilliath/react-kit@0.2.0

## 0.2.1

### Patch Changes

- 5ea7fd8: Updated internal dependencies to the renamed `@forthtilliath/react-kit` (was `@forthtilliath/react-hooks`) and `@forthtilliath/ts-types` (was `@forthtilliath/types`) — no behavior change.
- Updated dependencies [5ea7fd8]
  - @forthtilliath/react-kit@0.1.0

## 0.2.0

### Minor Changes

- d756eb4: First public release. `@forthtilliath/forth-ui`, `@forthtilliath/shadcn-ui`, and `@forthtilliath/react-hooks` are now built to `dist/` and published to npm — no source-level changes to their components/hooks in this release.

### Patch Changes

- Updated dependencies [d756eb4]
  - @forthtilliath/shadcn-ui@0.2.0
  - @forthtilliath/react-hooks@0.1.0

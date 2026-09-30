# @forthtilliath/react-kit

## 0.5.0

### Minor Changes

- 1f11247: Hooks fixes:

  - `useKeyListener`: Ctrl, Alt and Meta now have to match exactly (`{ key: "s" }` no longer fires on Ctrl+S); Shift is only checked when specified. The callback receives the `KeyboardEvent`, and an inline callback no longer re-attaches the listener on every render. `KeyConfig` is exported.
  - `useIntersectionObserver` and `useHorizontalScroll`: the returned refs are now callback refs, so an element rendered conditionally after the first render is observed too (it silently wasn't before). **Type change**: they're functions, not `RefObject`s — passing them to a `ref` prop works as before, reading `.current` doesn't. An inline `threshold` array no longer recreates the observer on each render.
  - `useToggleState`: documented.

- 587ff55: `SlotOrCallback`: add an `args` prop, passed to a render-function child (it was always called with no argument). `args` is required by the types as soon as the render function declares parameters. `Repeat` now relies on it to pass the index.

### Patch Changes

- c1bd669: Relative imports in the published ESM now carry their `.js` extension (`./slot-or-callback.js`, `../button/index.js`), so the packages load under plain Node ESM (Vitest with externalized deps, SSR scripts…) and not only through a bundler. These packages now type-check with `moduleResolution: NodeNext`, which enforces it — except `react-native-kit` and `expo-release-updates-ui` (only ever loaded through Metro, they keep `bundler` resolution) and `shadcn-ui`, whose sources are shadcn components kept as-is: its `dist/` gets the extensions added by a post-build step instead.
- ccdad7c: `JsonLd`: escape `<` in the serialized data, so a value containing `</script>` can no longer close the tag and inject HTML.
- c512cde: `Show`: a render-function child now receives the `when` value, as documented (it was called with no argument).
- c512cde: Declare `react` (and `react-dom` for `forth-ui`/`shadcn-ui`) as peer dependencies instead of regular dependencies, so consumers never end up with a second copy of React ("Invalid hook call").
- c1bd669: Declare `sideEffects` (`false`, or `["*.css"]` for `forth-ui`/`shadcn-ui`) so bundlers can tree-shake unused modules, root barrels included. Internal dependencies are now published as caret ranges (`^0.4.0`) instead of exact versions.

## 0.4.0

### Minor Changes

- f4e5779: Add `useHorizontalScroll({ step?, keyboard? })`: tracks whether a horizontally scrollable container can scroll left/right (kept in sync by a `ResizeObserver`), with `scrollByStep` and optional arrow-key scrolling outside form fields.

## 0.3.0

### Minor Changes

- ca2e7c5: Added the most commonly used React hooks in production apps: `useDebounce`, `useThrottle`, `useMediaQuery`, `useClickOutside`, `useOnlineStatus`, `useIntersectionObserver`, `useCopyToClipboard` and `useControllableState`. Each is its own module, importable from `@forthtilliath/react-kit/<hookName>`.

## 0.2.1

### Patch Changes

- df89512: Add the missing `"use client"` directive to `FocusOnMount`, `usePersistentState`, `useKeyListener` and `useToggleState`. Without it, rendering `FocusOnMount` (or calling one of the hooks) from a Server Component crashed with `TypeError: useRef is not a function` during SSR.

## 0.2.0

### Minor Changes

- 0b0c639: Added `usePersistentState` (localStorage-backed state, SSR-safe, synced across tabs), `FocusOnMount` (moves focus to a freshly rendered region without scrolling, for screen-reader announcements) and `JsonLd` (injects a JSON-LD `<script>` block from server-built data). No new dependencies.

## 0.1.0

### Minor Changes

- 5ea7fd8: First release. Merges the deprecated `@forthtilliath/react-hooks` (`useKeyListener`, `useToggleState`) and `@forthtilliath/react-ui` (`Show`, `Repeat`, `SlotOrCallback`) into a single package, named to mirror `@forthtilliath/react-native-kit`. No behavior change to the hooks/components themselves — build switched from `tsup` to `tsc` for consistency with the rest of the monorepo.

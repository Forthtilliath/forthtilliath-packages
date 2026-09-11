# @forthtilliath/react-kit

## 0.2.0

### Minor Changes

- 0b0c639: Added `usePersistentState` (localStorage-backed state, SSR-safe, synced across tabs), `FocusOnMount` (moves focus to a freshly rendered region without scrolling, for screen-reader announcements) and `JsonLd` (injects a JSON-LD `<script>` block from server-built data). No new dependencies.

## 0.1.0

### Minor Changes

- 5ea7fd8: First release. Merges the deprecated `@forthtilliath/react-hooks` (`useKeyListener`, `useToggleState`) and `@forthtilliath/react-ui` (`Show`, `Repeat`, `SlotOrCallback`) into a single package, named to mirror `@forthtilliath/react-native-kit`. No behavior change to the hooks/components themselves — build switched from `tsup` to `tsc` for consistency with the rest of the monorepo.

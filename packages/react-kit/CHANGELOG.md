# @forthtilliath/react-kit

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

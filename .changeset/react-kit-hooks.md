---
"@forthtilliath/react-kit": minor
---

Hooks fixes:

- `useKeyListener`: Ctrl, Alt and Meta now have to match exactly (`{ key: "s" }` no longer fires on Ctrl+S); Shift is only checked when specified. The callback receives the `KeyboardEvent`, and an inline callback no longer re-attaches the listener on every render. `KeyConfig` is exported.
- `useIntersectionObserver` and `useHorizontalScroll`: the returned refs are now callback refs, so an element rendered conditionally after the first render is observed too (it silently wasn't before). **Type change**: they're functions, not `RefObject`s — passing them to a `ref` prop works as before, reading `.current` doesn't. An inline `threshold` array no longer recreates the observer on each render.
- `useToggleState`: documented.

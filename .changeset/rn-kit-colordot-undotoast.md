---
"@forthtilliath/react-native-kit": minor
---

Added `ColorDot` and `UndoToast` (`components/list/`), two dependency-free presentational primitives. `ColorDot` is the small round color swatch next to a category/team/tag and renders nothing when its `color` is undefined. `UndoToast` is a bottom-of-screen "undo" snackbar for actions that run immediately without a confirmation dialog (e.g. a swipe-to-delete) — presentational only, the host owns the timeout, animation and pending state. Both take an optional `styles` prop with neutral defaults. No new peer dependencies.

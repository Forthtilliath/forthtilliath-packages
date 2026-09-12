---
"@forthtilliath/react-kit": patch
---

Add the missing `"use client"` directive to `FocusOnMount`, `usePersistentState`, `useKeyListener` and `useToggleState`. Without it, rendering `FocusOnMount` (or calling one of the hooks) from a Server Component crashed with `TypeError: useRef is not a function` during SSR.

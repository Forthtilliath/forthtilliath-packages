---
"@forthtilliath/react-native-kit": patch
---

`useSubmitGuard`: two calls made before a re-render (a fast double tap) no longer both run the action — the lock is now a ref instead of the `isSaving` state.

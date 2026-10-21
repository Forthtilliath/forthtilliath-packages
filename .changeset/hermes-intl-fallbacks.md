---
"@forthtilliath/ts-kit": patch
---

`pluralize` / `createPluralize` and `formatRelativeTime` no longer crash on Hermes (React Native on Android), which has no `Intl.PluralRules` nor `Intl.RelativeTimeFormat`: a built-in French/English fallback takes over.

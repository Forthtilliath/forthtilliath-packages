---
"@forthtilliath/react-kit": patch
"@forthtilliath/forth-ui": patch
"@forthtilliath/shadcn-ui": patch
---

Declare `react` (and `react-dom` for `forth-ui`/`shadcn-ui`) as peer dependencies instead of regular dependencies, so consumers never end up with a second copy of React ("Invalid hook call").

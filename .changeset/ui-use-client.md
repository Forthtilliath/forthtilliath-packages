---
"@forthtilliath/forth-ui": patch
---

Add the missing `"use client"` directive to components relying on state, context or event handlers, so they can be rendered from a React Server Component: `Grid`/`GridItem` and `Pagination`.

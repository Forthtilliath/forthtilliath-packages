---
"@forthtilliath/forth-ui": patch
---

Move `@forthtilliath/ts-types` to `dependencies`: the published type declarations (`Grid`, `GridItem`) import it, so it was missing for consumers.

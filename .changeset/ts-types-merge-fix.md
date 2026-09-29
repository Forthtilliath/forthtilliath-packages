---
"@forthtilliath/ts-types": patch
---

`Merge<F, S>`: a property both types declare with incompatible types now resolves to `S`'s type. It used to collapse the whole result into an index signature accepting anything (`F & S` reduced that property to `never`, so `keyof (F & S)` became `string | number | symbol`). Optional and readonly modifiers are kept.

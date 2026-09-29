---
"@forthtilliath/react-kit": minor
---

`SlotOrCallback`: add an `args` prop, passed to a render-function child (it was always called with no argument). `args` is required by the types as soon as the render function declares parameters. `Repeat` now relies on it to pass the index.

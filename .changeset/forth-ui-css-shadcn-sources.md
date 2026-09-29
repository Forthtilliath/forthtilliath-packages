---
"@forthtilliath/forth-ui": patch
---

`globals.css` now includes the classes used by the shadcn-ui components forth-ui builds on — notably tw-animate-css's `animate-in` / `animate-out` family, missing from every published version so far: Dialog, Sheet, Popover, Tooltip… had no enter/exit animation with forth-ui's CSS alone. The file grows accordingly (≈19 kB brotli, was ≈12 kB).

---
"@forthtilliath/forth-ui": patch
---

- **Accordion** — `hideChevron` now actually hides the chevron (it never did: the customized shadcn trigger rendered the default chevron instead). The trigger is built on the Radix primitive inside forth-ui, so the component also works with the upstream shadcn `accordion` (registry installs).
- **Grid** — `ClassValue` comes from `clsx` rather than shadcn-ui's `lib/utils` (which upstream shadcn doesn't export it from).
- Both are now published in the shadweb registry (`grid` was left out).

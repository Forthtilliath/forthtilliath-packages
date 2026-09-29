---
"@forthtilliath/forth-ui": patch
---

Found by the new Storybook interaction tests:

- **Rating** — real keyboard support (WAI-ARIA radio group): arrows move the rating, Home/End jump to the ends, and the stars are a single Tab stop (roving tabindex) instead of one each.
- **ConfirmDialog** — no longer renders an empty, unnamed dialog while animating out.
- **Named dialogs** — the popovers of Combobox, MultiSelect, DatePicker and NotificationCenter, and Navbar's mobile menu (screen-reader-only title), now have an accessible name.

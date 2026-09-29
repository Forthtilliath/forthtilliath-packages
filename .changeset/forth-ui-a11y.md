---
"@forthtilliath/forth-ui": patch
"@forthtilliath/shadcn-ui": patch
---

Accessibility (WCAG AA, checked by axe on every Storybook story):

- **Contrast** — solid `success`/`info` Alert and Badge use the -700 shade (white text), solid `warning` keeps amber with dark text, `destructive` soft uses the red palette; colored Alerts give their description their own text color; Avatar fallback colors set an explicit, readable text color (and `-full` ones a -800 / dark:-200 one); MultiStepLoader's upcoming steps are no longer faded. shadcn-ui's default theme `--muted-foreground` is slightly darker (0.545) to reach 4.5:1 on `--muted`.
- **Names** — Combobox / MultiSelect triggers get an accessible name (`ariaLabel`, or the placeholder) and accept Field's `id` / `aria-describedby` / `aria-invalid`; TagsInput takes `id` / `ariaLabel`; ColorPicker's hex input is labelled; Progress is named by its `label`.
- **Markup** — Breadcrumb no longer puts a `<span>` inside its `<ol>`; ScrollShadow is keyboard-focusable (so keyboard users can scroll it).
- Badge / Alert: `look="outline"` no longer strips the background of the neutral variants.

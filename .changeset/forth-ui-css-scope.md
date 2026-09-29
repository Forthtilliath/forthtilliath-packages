---
"@forthtilliath/forth-ui": minor
---

Leaner published stylesheet (`styles/globals.css`): it now covers forth-ui's components and only the shadcn-ui components they're built on (≈20 → 15 kB brotli), and no longer ships Storybook-only rules (the safelist and `.docs-story` styles). **If you import this file and also use other shadcn-ui components directly** (Sidebar, Table, Select…), switch to the Tailwind setup described under "Theming" in the README, which scans both packages.

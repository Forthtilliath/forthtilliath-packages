---
"@forthtilliath/forth-ui": minor
---

New components, moved up from the apps of this repo:

- **`ModeToggle`** + **`ThemeProvider`** (`components/mode-toggle`) — a light / dark / system theme switcher (French / English labels) and next-themes' provider behind a `"use client"` boundary. `next-themes` is a new **optional** peer dependency, only needed for this entry point.
- **`ThemeImage`** (`components/theme-image`) — an image with a light and a dark version, switched by the `dark` variant; `as={Image}` renders Next.js' `Image`.
- **`CopyMenuItem`** (`components/copy-menu-item`) — a `DropdownMenuItem` that copies a value and briefly shows a checkmark, keeping the menu open.

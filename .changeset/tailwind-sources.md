---
"@forthtilliath/shadcn-ui": minor
"@forthtilliath/forth-ui": minor
---

Add `styles/sources.css`, which registers the pre-built components with the consumer's Tailwind build (`@import "@forthtilliath/forth-ui/styles/sources.css";`). Its `@source` paths are relative to the package, so it works with any `node_modules` layout — the previously documented `@source "../node_modules/@forthtilliath/*/dist/**/*.js"` matched nothing under pnpm, leaving forth-ui components unstyled.

---
"@forthtilliath/react-kit": patch
"@forthtilliath/forth-ui": patch
"@forthtilliath/shadcn-ui": patch
"@forthtilliath/react-native-kit": patch
"@forthtilliath/expo-release-updates-ui": patch
---

Relative imports in the published ESM now carry their `.js` extension (`./slot-or-callback.js`, `../button/index.js`), so the packages load under plain Node ESM (Vitest with externalized deps, SSR scripts…) and not only through a bundler. These packages now type-check with `moduleResolution: NodeNext`, which enforces it — except `react-native-kit` and `expo-release-updates-ui` (only ever loaded through Metro, they keep `bundler` resolution) and `shadcn-ui`, whose sources are shadcn components kept as-is: its `dist/` gets the extensions added by a post-build step instead.

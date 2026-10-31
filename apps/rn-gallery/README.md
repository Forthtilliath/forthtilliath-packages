# rn-gallery

Renders `@forthtilliath/react-native-kit` components in a browser (react-native-web + Vite) to produce the screenshots of the kit's README. Not an app to ship: no build, no tests, nothing deployed.

```bash
pnpm --filter @forthtilliath/react-native-kit build   # the gallery imports the kit's dist/
pnpm --filter rn-gallery screenshots                  # every demo → packages/react-native-kit/docs/screenshots/*.png
pnpm --filter rn-gallery screenshots toast button     # only some
pnpm --filter rn-gallery dev                          # browse the demos on http://localhost:5199
```

Each demo (`src/demos/`) draws the component twice, side by side: with its neutral defaults, then themed with an app's dark palette (`colors` / `styles` props). Add one to `src/demos/index.ts` and to `ALL` in `scripts/capture.mjs`.

Rendering notes:

- Roboto (Android's font) is forced on every text; Ionicons come from `@expo/vector-icons`'s own font file through a small shim (`src/shims/vector-icons.tsx`), since the real package loads fonts with expo-font.
- react-native-web draws a `Modal` over the whole page: the bottom-sheet demo draws the sheet in place, with `BottomSheetHeader` and BottomSheet's default sheet style.
- Playwright runs Chromium with LCD text off and a device scale factor of 2 (no ClearType fringing on Windows).

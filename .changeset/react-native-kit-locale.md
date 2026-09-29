---
"@forthtilliath/react-native-kit": minor
---

Bilingual built-in copy and quality pass:

- **`locale` prop (`"fr" | "en"`)** on every component with built-in copy, plus a `KitLocaleProvider` to set it once for a whole tree (a component's own `locale` wins; `labels` still overrides individual strings). `confirmDestructive` takes `{ locale }`. French stays the default.
- **Behavior changes** — defaults aligned on French: `UndoToast`'s `actionLabel` is now "Annuler" (was "Undo"), `SwipeableRow`'s `deleteText` "Supprimer" (was "Delete"), `VoiceSearchButton`'s accessibility labels are French and it **recognizes French by default** (`fr-FR`, was `en-US`) — which also fixes `PickerModal`'s dictation, which never passed a language. Pass `locale="en"` (or the explicit props) to get the previous English behavior.
- **`SwipeableRow`** now uses `ReanimatedSwipeable` instead of the deprecated `Swipeable`: **`react-native-reanimated` is a new peer dependency** (only for `SwipeableRow`).
- **`BackupSettingsScreen`**: a fast double tap no longer runs export/import twice (now built on `useSubmitGuard`); split into a component and a `.styles.ts` file.
- New **`mergeSlotStyles`** helper, used by every component instead of the per-component style-merging boilerplate.
- `UndoToast`'s docs referenced a non-existent `SwipeToDeleteRow`; remaining French code comments translated to English.

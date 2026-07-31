# @forthtilliath/react-native-kit

Small React Native building blocks — components, hooks, and framework-agnostic utils — with no opinion on your app's theme, distributed one file per export so consumers only pull in what they use.

## Install

```bash
npm install @forthtilliath/react-native-kit react react-native
```

Or, from within this monorepo, as a workspace dependency:

```json
{
  "dependencies": {
    "@forthtilliath/react-native-kit": "workspace:*"
  }
}
```

`react` and `react-native` are peer dependencies — install them in the consuming app if not already present.

## Usage

Each component is its own module — import the file you need directly:

```ts
import { ChangelogNotes } from "@forthtilliath/react-native-kit/ChangelogNotes";
```

### `<ChangelogNotes notes={...} styles={...} />`

Renders GitHub-style release notes — as produced by `@forthtilliath/expo-release-updates`'s `parseChangelogNotes` — as headings, bulleted items, and bold-aware text, instead of showing the raw Markdown syntax in a plain `Text`.

```tsx
<ChangelogNotes notes={release.notes} />
```

It understands the small subset of Markdown GitHub release notes actually use:

| `notes` input                             | Rendered as                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| `### Added`                               | a heading `Text` — `"Added"`                                                |
| `- Export history to CSV.`                | a row (`View`) with a `•` bullet `Text` and an item `Text`                  |
| `**Auto-backup**: saves every 5 minutes.` | a plain `Text`, with the bold segment split into its own bold-styled `Text` |

A full example, mixing all three:

```tsx
<ChangelogNotes
  notes={`### Added\n- **Auto-backup**: saves every 5 minutes.\n- Export history to CSV.\n\nSee the full changelog for details.`}
/>
```

The component ships with neutral default styles and no opinion on your app's theme. Override any subset via the `styles` prop to match your colors/dark mode:

```tsx
<ChangelogNotes
  notes={release.notes}
  styles={{
    heading: { color: colors.text, fontWeight: "700" },
    itemRow: { gap: 8 },
    bullet: { color: colors.primary },
    itemText: { color: colors.textMuted },
    text: { color: colors.textMuted },
    bold: { color: colors.text, fontWeight: "700" },
  }}
/>
```

Every field of `styles` is optional — pass only the ones you want to override; the rest fall back to the defaults (`ChangelogNotesStyles` in `ChangelogNotes.tsx`).

### `useSubmitGuard()`

Prevents a second call while a first one is still pending — e.g. a double-tap on a "Save" button before it's had time to disable, which would otherwise create duplicate submissions.

```tsx
import { useSubmitGuard } from "@forthtilliath/react-native-kit/useSubmitGuard";

const { isSaving, guard } = useSubmitGuard();

<Pressable
  disabled={isSaving}
  onPress={() =>
    guard(async () => {
      await save();
    })
  }
>
  <Text>{isSaving ? "Saving…" : "Save"}</Text>
</Pressable>;
```

### `useDebouncedChange(values, delayMs, callback)`

Calls `callback` `delayMs` after the last change among `values`, ignoring renders where any value is still `undefined` (not loaded yet) and the very first render where they're all defined (no trigger on mount). A new change before the delay elapses resets the timer — a real debounce, not a throttle.

```tsx
import { useDebouncedChange } from "@forthtilliath/react-native-kit/useDebouncedChange";

useDebouncedChange([settingsData, itemsData], 5 * 60 * 1000, () => {
  runAutoBackup();
});
```

### `confirmDestructive(title, onConfirm, options?)`

Generic destructive-action confirmation (title + message + Cancel/Confirm), for anything irreversible (delete, reset...). Ships with French defaults (`message`, `cancelLabel`, `confirmLabel` all overridable).

```ts
import { confirmDestructive } from "@forthtilliath/react-native-kit/confirmDestructive";

confirmDestructive("Delete this item?", () => deleteItem(id), {
  message: "This cannot be undone.",
  cancelLabel: "Cancel",
  confirmLabel: "Delete",
});
```

### Utils (`utils/`)

Framework-agnostic pure functions — no React or React Native import, usable from Node/web too.

```ts
import { getPeriodStartMs } from "@forthtilliath/react-native-kit/utils/getPeriodStartMs";
import { getMostRecentIds } from "@forthtilliath/react-native-kit/utils/getMostRecentIds";
import { nextInCycle } from "@forthtilliath/react-native-kit/utils/nextInCycle";
import { normalizeForSearch } from "@forthtilliath/react-native-kit/utils/normalizeForSearch";
import { rankByNameMatch } from "@forthtilliath/react-native-kit/utils/rankByNameMatch";
import { escapeCsvField } from "@forthtilliath/react-native-kit/utils/escapeCsvField";
import { formatCsvNumber } from "@forthtilliath/react-native-kit/utils/formatCsvNumber";
import { escapeHtml } from "@forthtilliath/react-native-kit/utils/escapeHtml";
```

| Function                                 | What it does                                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `getPeriodStartMs(period, now?)`         | Start timestamp (ms) for a `"today" \| "7d" \| "30d" \| "all"` period filter, or `null` for `"all"`. `"today"` is the current calendar day, not a rolling 24h.     |
| `getMostRecentIds(rows, limit?)`         | Most recently occurring distinct ids (`{ id, occurredAt }[]`), most recent first, deduplicated, limited (default 5).                                               |
| `nextInCycle(ids, currentId)`            | Next id in a short list (e.g. cycling through recents on tap) — wraps to the first if `currentId` is at the end or no longer in the list.                          |
| `normalizeForSearch(text)`               | Lowercases, trims, strips accents, and expands `œ`/`æ` ligatures (which `normalize("NFD")` alone doesn't decompose) — for accent/case-insensitive search matching. |
| `rankByNameMatch(items, query, getName)` | Ranks `items` by relevance to `query`: earlier match position first, then shorter name — for a search-as-you-type list.                                            |
| `escapeCsvField(value)`                  | Quotes and escapes a CSV field (RFC 4180) only if it contains a `"`, `;`, or newline.                                                                              |
| `formatCsvNumber(value, decimals?)`      | Formats a number with a comma decimal separator (French-locale spreadsheets) instead of JS's dot.                                                                  |
| `escapeHtml(text)`                       | Basic HTML entity escaping (`&`, `<`, `>`, `"`) for inserting user text into an HTML template.                                                                     |

## Scripts

```bash
pnpm run dev            # tsc --watch -> dist/
pnpm run build          # tsc -> dist/
pnpm run check-types    # tsc --noEmit
pnpm run lint           # eslint
pnpm run test           # vitest run
pnpm run test:watch     # vitest
```

Built to `dist/` (see the `exports` field in `package.json`), so run `pnpm run build` (or `dev`) after source changes for consumers to see them.

### Testing note

`react-native`'s package entry uses Flow syntax that `@babel/parser`'s flow plugin can't parse (`as Cast` casts aren't supported there), so Vitest can never load the real package directly. Tests alias `react-native` to a minimal stub (`src/__mocks__/react-native.tsx`) instead — see that file for details.

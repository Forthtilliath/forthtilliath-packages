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

`react` and `react-native` are peer dependencies — install them in the consuming app if not already present. `@expo/vector-icons`, `expo-image-picker`, `expo-speech-recognition`, and `react-native-gesture-handler` are also peer dependencies, needed only if you import the components that use them (`Thumbnail`/`PickerModal`/`SwipeableRow`, `PhotoPicker`, `VoiceSearchButton`/`PickerModal`, `SwipeableRow`, respectively).

## Usage

Each component is its own module — import the file you need directly:

```ts
import { ChangelogNotes } from "@forthtilliath/react-native-kit/ChangelogNotes";
```

This is the recommended way to import: Metro (React Native's bundler) doesn't reliably tree-shake, so pulling from a single deep-import path keeps peer dependencies you don't use (`expo-image-picker`, `expo-speech-recognition`, `react-native-gesture-handler`...) out of your bundle entirely, rather than merely unused.

A root barrel is also available for convenience when you don't mind that trade-off:

```ts
import {
  ChangelogNotes,
  useSubmitGuard,
} from "@forthtilliath/react-native-kit";
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

### `<Thumbnail photoUri={...} placeholderIcon="..." />`

List-row thumbnail: the photo if there is one, otherwise a placeholder icon.

```tsx
import { Thumbnail } from "@forthtilliath/react-native-kit/Thumbnail";

<Thumbnail
  photoUri={container.photoUri}
  placeholderIcon="cube-outline"
  size={48}
/>;
```

### `<SwipeableRow onDelete={...} deleteLabel="...">`

Swipe a list row left to reveal a delete button, on top of a tap to edit it.

```tsx
import { SwipeableRow } from "@forthtilliath/react-native-kit/SwipeableRow";

<SwipeableRow
  onDelete={() => remove(item.id)}
  deleteLabel={`Delete ${item.name}`}
>
  <ItemRow item={item} />
</SwipeableRow>;
```

### `<VoiceSearchButton onResult={...} />`

Microphone button to dictate a search instead of typing it. Safe to mount more than one at a time (e.g. a name field plus a search picker on the same screen) — only the instance that started listening reacts to its result.

```tsx
import { VoiceSearchButton } from "@forthtilliath/react-native-kit/VoiceSearchButton";

<VoiceSearchButton onResult={setQuery} lang="en-US" />;
```

### `<PhotoPicker photoUri={...} onChange={...} savePhoto={...} photoLabel="..." />`

Photo picker (camera or library) with a preview and a remove link. `savePhoto` is injected rather than hard-coded, so where/how the picked image gets persisted is entirely up to the caller.

```tsx
import { PhotoPicker } from "@forthtilliath/react-native-kit/PhotoPicker";

<PhotoPicker
  photoUri={container.photoUri}
  onChange={(uri) => setPhotoUri(uri)}
  savePhoto={(sourceUri) => saveContainerPhoto(sourceUri)}
  photoLabel="of the container"
/>;
```

### `<PickerModal visible title items onSelect onClose />`

Full-screen picker: search (typed or dictated via `VoiceSearchButton`), optional sections, and "add" actions always visible above the results.

```tsx
import {
  PickerModal,
  type PickerItem,
} from "@forthtilliath/react-native-kit/PickerModal";

<PickerModal
  visible={pickerVisible}
  title="Choose a container"
  items={containers.map((c): PickerItem => ({
    id: c.id,
    label: c.name,
    imageUri: c.photoUri,
  }))}
  onSelect={(item) => setContainerId(item.id)}
  onClose={() => setPickerVisible(false)}
  extraActions={[
    {
      label: "Add a new container",
      onPress: () => router.push("/containers/new"),
    },
  ]}
/>;
```

Groups results into sections via each item's `group` (e.g. food groups, ingredients vs recipes) — ignored while searching, where the best global matches are shown instead. Pass `filterItems` for custom ranking (e.g. `rankByNameMatch` from this same package's `utils/`) instead of the default case-insensitive substring match.

For all 5 components above, styling and (where relevant) copy work the same way as `ChangelogNotes`: an optional `styles` prop (all fields optional, neutral defaults) and, for `PhotoPicker`/`PickerModal`, an optional `labels` prop for the built-in French copy.

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

### `useEffectiveColorScheme(preference)`

Resolves a `"light" | "dark" | "system"` theme preference against the device's color scheme: `"system"` follows the device, `"light"`/`"dark"` override it regardless of what the device is set to.

```tsx
import { useEffectiveColorScheme } from "@forthtilliath/react-native-kit/useEffectiveColorScheme";

const scheme = useEffectiveColorScheme(themePreference); // "light" | "dark"
const colors = scheme === "dark" ? darkColors : lightColors;
```

### `<ThemeToggle value onChange />`

3-way segmented control for a light/dark/system theme preference.

```tsx
import { ThemeToggle } from "@forthtilliath/react-native-kit/ThemeToggle";

<ThemeToggle value={themePreference} onChange={setThemePreference} />;
```

### `useUpdateCheck(options)`

Checks once per mount (e.g. app launch) whether a newer release is available, throttled to at most one real check per `minIntervalMs` (default 12h) and silent for a release the user already dismissed. Has no opinion on where "when did we last check" / "which version did the user dismiss" are persisted — both are read/written entirely through the options you pass in.

```tsx
import { useUpdateCheck } from "@forthtilliath/react-native-kit/useUpdateCheck";

const update = useUpdateCheck({
  currentVersion: Constants.expoConfig?.version ?? "0.0.0",
  checkForUpdate: fetchLatestRelease,
  compareVersions,
  getLastCheck: () => ({
    lastCheckedAt: settings?.lastUpdateCheckAt ?? null,
    dismissedVersion: settings?.dismissedUpdateVersion ?? null,
  }),
  onChecked: (lastCheckedAt) =>
    updateSettings({ lastUpdateCheckAt: lastCheckedAt }),
});

if (update.status === "available") {
  // update.release.version / .notes / .apkUrl
}
```

### `<UpdateAvailableBanner version notes onPress onDismiss />`

Dismissible banner announcing an available update: version, release notes (rendered via `ChangelogNotes`), an action button and a dismiss button. Has no opinion on what the action does (e.g. navigate to an update screen) or on how/whether dismissal is persisted.

```tsx
import { UpdateAvailableBanner } from "@forthtilliath/react-native-kit/UpdateAvailableBanner";

{
  update.status === "available" && (
    <UpdateAvailableBanner
      version={update.release.version}
      notes={update.release.notes}
      onPress={() => router.push("/settings/update")}
      onDismiss={() => {
        dismissUpdateVersion(update.release.version);
        update.dismiss();
      }}
    />
  );
}
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

`react-native`'s package entry uses Flow syntax that `@babel/parser`'s flow plugin can't parse (`as Cast` casts aren't supported there), so Vitest can never load the real package directly. Tests alias `react-native` to a minimal stub (`src/__mocks__/react-native.tsx`) instead — see that file for details. `react-native-gesture-handler` ships the same kind of Flow syntax, and `@expo/vector-icons` has its own unrelated ESM-resolution issue under Vite/Rollup — both are stubbed the same way (`src/__mocks__/react-native-gesture-handler.tsx`, `src/__mocks__/expo-vector-icons.tsx`). `expo-speech-recognition` and `expo-image-picker` wrap native modules unavailable under Vitest regardless, so they're mocked with plain spies (`src/__mocks__/expo-speech-recognition.tsx`, `src/__mocks__/expo-image-picker.ts`).

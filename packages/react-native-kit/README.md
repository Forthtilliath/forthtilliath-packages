# @forthtilliath/react-native-kit

Small React Native building blocks — components, hooks, and a framework-agnostic util — with no opinion on your app's theme, distributed one file per export (grouped under `components/{picker,theme,list,settings}/`, `hooks/`, `utils/helpers/`) so consumers only pull in what they use. Update-checking UI (`ChangelogNotes`, `UpdateAvailableBanner`, `useUpdateCheck`) lives in the sibling `@forthtilliath/expo-release-updates-ui` package instead.

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
import { PhotoPicker } from "@forthtilliath/react-native-kit/components/picker/PhotoPicker";
```

This is the recommended way to import: Metro (React Native's bundler) doesn't reliably tree-shake, so pulling from a single deep-import path keeps peer dependencies you don't use (`expo-image-picker`, `expo-speech-recognition`, `react-native-gesture-handler`...) out of your bundle entirely, rather than merely unused.

A root barrel is also available for convenience:

```ts
import { PhotoPicker, useSubmitGuard } from "@forthtilliath/react-native-kit";
```

**Avoid the barrel under Jest (or any other CommonJS `require` consumer).** `export * from` re-exports are evaluated eagerly on `require()` — unlike Metro's ESM bundling, there's no tree-shaking to skip the unused ones. Requiring the barrel from _any_ file, even one that only wants a framework-agnostic util like `getMostRecentIds`, pulls in every component's module graph, including native-module imports (`expo-speech-recognition` via `VoiceSearchButton`/`PickerModal`) that don't exist in a Jest environment — this throws `Cannot find native module '...'` at require time, not just at runtime for an unrendered component. Deep imports only ever load the one module you asked for, so they don't have this problem in any environment.

### `<Thumbnail photoUri={...} placeholderIcon="..." />`

List-row thumbnail: the photo if there is one, otherwise a placeholder icon.

```tsx
import { Thumbnail } from "@forthtilliath/react-native-kit/components/list/Thumbnail";

<Thumbnail
  photoUri={container.photoUri}
  placeholderIcon="cube-outline"
  size={48}
/>;
```

### `<SwipeableRow onDelete={...} deleteLabel="...">`

Swipe a list row left to reveal a delete button, on top of a tap to edit it.

```tsx
import { SwipeableRow } from "@forthtilliath/react-native-kit/components/list/SwipeableRow";

<SwipeableRow
  onDelete={() => remove(item.id)}
  deleteLabel={`Delete ${item.name}`}
>
  <ItemRow item={item} />
</SwipeableRow>;
```

### `<ColorDot color={...} />`

A small round color swatch — the coloured bullet next to a category, a team, a
tag, or a status. **Renders `null` when `color` is `undefined`**, so a list row
can bind an optional color field without guarding it at the call site.

```tsx
import { ColorDot } from "@forthtilliath/react-native-kit/components/list/ColorDot";

<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
  <ColorDot color={category.color} />
  <Text>{category.name}</Text>
</View>;
```

| Prop    | Type                   | Default | Notes                                                             |
| ------- | ---------------------- | ------- | ----------------------------------------------------------------- |
| `color` | `string \| undefined`  | —       | Any RN color string. `undefined` → renders nothing.               |
| `size`  | `number`               | `10`    | Diameter in px; always a full circle (`borderRadius = size / 2`). |
| `style` | `StyleProp<ViewStyle>` | —       | Merged **after** the computed style, so it wins on conflicts.     |

```tsx
// Bigger, with a subtle ring, and some trailing space:
<ColorDot
  color={team.color}
  size={16}
  style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.15)", marginRight: 6 }}
/>
```

### `<UndoToast message={...} onAction={...} />`

A bottom-of-screen snackbar for **undoing an action that already happened** —
the counterpart to a delete that runs immediately with no confirmation dialog
(for instance a `SwipeableRow` swipe). Presentational only: it does not time
itself out, animate, or stack — the host owns the "pending undo" state, the
commit timer, and any enter/exit animation, which keeps this component free of
timer or animation-library opinions.

```tsx
import { UndoToast } from "@forthtilliath/react-native-kit/components/list/UndoToast";

{
  recentlyDeleted && (
    <UndoToast
      message={`"${recentlyDeleted.name}" deleted`}
      onAction={restoreLast}
    />
  );
}
```

| Prop          | Type              | Default  | Notes                                                                               |
| ------------- | ----------------- | -------- | ----------------------------------------------------------------------------------- |
| `message`     | `string`          | —        | Past tense; single line, truncated with an ellipsis.                                |
| `actionLabel` | `string`          | `"Undo"` | The tappable label on the right.                                                    |
| `onAction`    | `() => void`      | —        | Reverse the change here. The host then hides the toast.                             |
| `styles`      | `UndoToastStyles` | —        | Per-slot overrides (`toast` / `message` / `action`), each merged after its default. |

Full pattern — commit for good after 5s, localized label, re-themed:

```tsx
const [pending, setPending] = useState<Employee | null>(null);

function remove(employee: Employee) {
  setEmployees((list) => list.filter((e) => e.id !== employee.id));
  setPending(employee);
}

useEffect(() => {
  if (!pending) return;
  const id = setTimeout(() => {
    db.deleteEmployee(pending.id); // point of no return
    setPending(null);
  }, 5000);
  return () => clearTimeout(id);
}, [pending]);

{
  pending && (
    <UndoToast
      message={`« ${pending.name} » supprimé`}
      actionLabel="Annuler"
      onAction={() => {
        setEmployees((list) => [...list, pending]);
        setPending(null);
      }}
      styles={{
        toast: { backgroundColor: colors.inverseSurface },
        message: { color: colors.inverseOnSurface },
        action: { color: colors.inversePrimary },
      }}
    />
  );
}
```

### `<VoiceSearchButton onResult={...} />`

Microphone button to dictate a search instead of typing it. Safe to mount more than one at a time (e.g. a name field plus a search picker on the same screen) — only the instance that started listening reacts to its result.

```tsx
import { VoiceSearchButton } from "@forthtilliath/react-native-kit/components/picker/VoiceSearchButton";

<VoiceSearchButton onResult={setQuery} lang="en-US" />;
```

### `<PhotoPicker photoUri={...} onChange={...} savePhoto={...} photoLabel="..." />`

Photo picker (camera or library) with a preview and a remove link. `savePhoto` is injected rather than hard-coded, so where/how the picked image gets persisted is entirely up to the caller.

```tsx
import { PhotoPicker } from "@forthtilliath/react-native-kit/components/picker/PhotoPicker";

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
} from "@forthtilliath/react-native-kit/components/picker/PickerModal";

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
import { useSubmitGuard } from "@forthtilliath/react-native-kit/hooks/useSubmitGuard";

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
import { useDebouncedChange } from "@forthtilliath/react-native-kit/hooks/useDebouncedChange";

useDebouncedChange([settingsData, itemsData], 5 * 60 * 1000, () => {
  runAutoBackup();
});
```

### `confirmDestructive(title, onConfirm, options?)`

Generic destructive-action confirmation (title + message + Cancel/Confirm), for anything irreversible (delete, reset...). Ships with French defaults (`message`, `cancelLabel`, `confirmLabel` all overridable).

```ts
import { confirmDestructive } from "@forthtilliath/react-native-kit/utils/helpers/confirmDestructive";

confirmDestructive("Delete this item?", () => deleteItem(id), {
  message: "This cannot be undone.",
  cancelLabel: "Cancel",
  confirmLabel: "Delete",
});
```

### `useEffectiveColorScheme(preference)`

Resolves a `"light" | "dark" | "system"` theme preference against the device's color scheme: `"system"` follows the device, `"light"`/`"dark"` override it regardless of what the device is set to.

```tsx
import { useEffectiveColorScheme } from "@forthtilliath/react-native-kit/hooks/useEffectiveColorScheme";

const scheme = useEffectiveColorScheme(themePreference); // "light" | "dark"
const colors = scheme === "dark" ? darkColors : lightColors;
```

### `<ThemeToggle value onChange />`

3-way segmented control for a light/dark/system theme preference.

```tsx
import { ThemeToggle } from "@forthtilliath/react-native-kit/components/theme/ThemeToggle";

<ThemeToggle value={themePreference} onChange={setThemePreference} />;
```

### `<ThemeOptionList value onChange />`

Same light/dark/system data contract as `ThemeToggle`, but rendered as a list of full-width rows (icon + label + checkmark on the active one) instead of a segmented control.

```tsx
import { ThemeOptionList } from "@forthtilliath/react-native-kit/components/theme/ThemeOptionList";

<ThemeOptionList value={themePreference} onChange={setThemePreference} />;
```

> `useUpdateCheck`, `<UpdateAvailableBanner>` and `<ChangelogNotes>` moved to
> [`@forthtilliath/expo-release-updates-ui`](../expo-release-updates-ui#readme) —
> install that package alongside this one if you need them.

### Settings screens (`components/settings/`)

The building blocks of a typical app "Settings" tab — menu, theme, update check, backup, about, contact, privacy — factored out so each new app stops rewriting the same ~7 screens from scratch. Expo Router (or any file-based router) still needs one physical route file per screen in your app; these just give each route file almost nothing left to write beyond rendering the matching component. None of them add new peer dependencies beyond what's already listed above.

```tsx
// app/(tabs)/settings/index.tsx
import { router } from "expo-router";
import { SettingsMenu } from "@forthtilliath/react-native-kit/components/settings/SettingsMenu";

export default function SettingsMenuScreen() {
  return (
    <SettingsMenu
      items={[
        // `key` doubles as the lookup into a built-in default icon/label
        // pairing for the 6 sections above — no `emoji`/`icon` needed here.
        {
          key: "backup",
          title: "Sauvegarde",
          hint: "Exporter / importer tes données",
          onPress: () => router.push("/settings/backup"),
        },
        {
          key: "theme",
          title: "Thème",
          hint: "Clair, sombre, ou automatique",
          onPress: () => router.push("/settings/theme"),
        },
        {
          key: "update",
          title: "Mise à jour",
          onPress: () => router.push("/settings/update"),
        },
        {
          key: "about",
          title: "À propos",
          onPress: () => router.push("/settings/about"),
        },
        {
          key: "contact",
          title: "Contact",
          onPress: () => router.push("/settings/contact"),
        },
        {
          key: "privacy",
          title: "Confidentialité",
          onPress: () => router.push("/settings/privacy"),
        },
        // An app-specific section: no default exists for an arbitrary key,
        // so `emoji`/`icon` (and `hint`, if you want one) are yours to set.
        {
          key: "profile",
          emoji: "🙋",
          title: "Mon nom",
          onPress: () => router.push("/settings/profile"),
        },
      ]}
    />
  );
}
```

`SettingsMenu` doesn't depend on expo-router (or any other navigator) itself — each item carries its own `onPress`, so it works the same with any navigation setup.

Two independent style knobs, both usable on their own:

- **Icon flavor** — each item can set its own `emoji` (naturally multicolor) or `icon` (an `Ionicons` glyph, name in `styles.iconColor`) to override its default; `defaultIconKind` (`"emoji"` by default, or `"icon"`) picks which flavor of the _default_ table applies to items that don't set either.
- **Hints** — set `showHints={false}` to hide every item's `hint` at once, for a denser, icon-only-style menu.

```tsx
<SettingsMenu
  items={[
    {
      key: "backup",
      title: "Sauvegarde",
      onPress: () => router.push("/settings/backup"),
    },
  ]}
  defaultIconKind="icon"
  showHints={false}
  styles={{
    row: { backgroundColor: colors.primary, borderWidth: 0 },
    iconColor: "#fff",
    title: { color: "#fff" },
  }}
/>
```

Pass `groups` instead of `items` to render rows under optional section headers (e.g. separating app-specific settings from the standard ones) — the two are mutually exclusive:

```tsx
<SettingsMenu
  groups={[
    {
      title: "Réglages de calcul",
      items: [
        {
          key: "ratio",
          emoji: "🧮",
          title: "Ratio glucidique",
          onPress: () => router.push("/settings/ratio"),
        },
      ],
    },
    {
      // No `title` renders the group with no header at all, e.g. for a
      // leading group of app-specific items above the standard ones.
      items: [
        {
          key: "backup",
          title: "Sauvegarde",
          onPress: () => router.push("/settings/backup"),
        },
      ],
    },
  ]}
/>
```

#### `<ThemeSettingsScreen value onChange />`

Same light/dark/system data contract as `ThemeToggle`/`ThemeOptionList`. Two visuals, picked via `variant`: `"emoji"` (default) — emoji + label + a plain-text `✓` on the active row — or `"icon"` — `Ionicons` glyphs in one shared color (`styles.iconColor`/`iconColorActive`) + an `Ionicons` checkmark, matching `SettingsMenu`'s `defaultIconKind="icon"` look. `showHint={false}` hides the hint above the list.

```tsx
import { ThemeSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/ThemeSettingsScreen";

<ThemeSettingsScreen value={themePreference} onChange={setThemePreference} />;

// Or, matching an icon-flavored SettingsMenu:
<ThemeSettingsScreen
  value={themePreference}
  onChange={setThemePreference}
  variant="icon"
/>;
```

#### `<UpdateSettingsScreen currentVersion checkForUpdate compareVersions downloadAndInstallApk />`

The full "check for update" screen: installed version, a manual check button, the available-update box (changelog + install button) or an up-to-date/error message, download progress, and — if `fetchReleaseHistory` is passed — a list of past releases. Checks automatically once on mount. Renders release notes via `@forthtilliath/expo-release-updates-ui`'s `ChangelogNotes`, and pairs naturally with that package's `useUpdateCheck`/`UpdateAvailableBanner` (same `checkForUpdate`/`compareVersions` you already pass those), but takes plain functions so it isn't tied to that package's exact shape.

```tsx
import { UpdateSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/UpdateSettingsScreen";

import {
  compareVersions,
  downloadAndInstallApk,
  fetchLatestRelease,
  fetchReleaseHistory,
} from "@/lib/appUpdate";

<UpdateSettingsScreen
  currentVersion={Constants.expoConfig?.version ?? "?"}
  checkForUpdate={fetchLatestRelease}
  compareVersions={compareVersions}
  downloadAndInstallApk={downloadAndInstallApk}
  fetchReleaseHistory={fetchReleaseHistory}
/>;
```

#### `<BackupSettingsScreen onExport onImport reminder? />`

Export/import buttons plus an optional reminder-notification switch. Deliberately just a shell: what actually gets exported/imported is entirely app-specific (your own database tables), so `onExport`/`onImport` are required — this package can't have a sensible default for "how do I export my schema". Import asks for confirmation first (via `confirmDestructive`, from `utils/helpers/`) since it replaces existing data; `onImport` itself doesn't need to.

```tsx
import { BackupSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/BackupSettingsScreen";

<BackupSettingsScreen
  onExport={shareBackup}
  onImport={pickAndImportBackup}
  reminder={{
    enabled: reminderEnabled,
    onToggle: handleToggleReminder,
    intervalDays: BACKUP_REMINDER_INTERVAL_DAYS,
  }}
/>;
```

Omit `reminder` entirely for an app with no backup-reminder notifications.

Three more knobs for apps whose backup section doesn't fit the compact 2-button shell: an `info` box above everything (e.g. "last auto-backup: ..."), `layout="sections"` for a titled, full-width, stacked layout instead of side-by-side buttons, and `icons` for a leading `Ionicons` glyph on either button.

```tsx
<BackupSettingsScreen
  onExport={shareBackup}
  onImport={pickAndImportBackup}
  info={{ label: "Dernière sauvegarde auto", value: lastAutoBackupLabel }}
  layout="sections"
  icons={{ export: "cloud-upload-outline", import: "cloud-download-outline" }}
/>
```

#### `<AboutSettingsScreen appName version description developerName? sections? />`

App name, version, one or more description paragraphs, and an optional "developed by" credit. `appName`/`version` are required rather than defaulted internally (keeps this package framework-agnostic) — pass `Constants.expoConfig?.name`/`.version` from the caller.

```tsx
import { AboutSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/AboutSettingsScreen";

<AboutSettingsScreen
  appName={Constants.expoConfig?.name ?? "My App"}
  version={Constants.expoConfig?.version ?? "?"}
  description="A personal tool to do the thing."
  developerName="Your Name"
/>;
```

Omit `developerName` for an app with no credit line to show. Pass `sections` for extra titled blocks after the description — e.g. a medical/legal disclaimer:

```tsx
<AboutSettingsScreen
  appName="GlucoDose"
  version="1.2.0"
  description="Un outil personnel de calcul de dose."
  sections={[
    {
      title: "Avertissement médical",
      paragraphs: ["Cet outil ne remplace pas un avis médical professionnel."],
    },
  ]}
/>
```

#### `<ContactSettingsScreen email actions? emailIcon? />`

A `mailto:` button plus a short "how to report a bug" hint.

```tsx
import { ContactSettingsScreen } from "@forthtilliath/react-native-kit/components/settings/ContactSettingsScreen";

<ContactSettingsScreen email="you@example.com" />;
```

Pass `actions` for extra rows below the email one (share the app, a donation link...) — switches the whole section from the single bordered button to a rows layout, email included:

```tsx
<ContactSettingsScreen
  email="you@example.com"
  actions={[
    { icon: "share-outline", label: "Partager l'app", onPress: shareApp },
    { icon: "star-outline", label: "Noter l'app", onPress: openStoreListing },
  ]}
/>
```

#### `<PrivacySettingsScreen sections? />`

Ships with the standard "everything stays on this device" three sections (no data collected, local storage only, sharing is opt-in) as the default — the right fit for most of these small personal-data apps. Pass your own `sections` to fully replace it for an app with different data handling (e.g. one that syncs to a server).

```tsx
import { PrivacySettingsScreen } from "@forthtilliath/react-native-kit/components/settings/PrivacySettingsScreen";

// Zero-config, uses the default copy:
<PrivacySettingsScreen />;

// Or fully custom:
<PrivacySettingsScreen
  sections={[
    {
      title: "What we collect",
      paragraphs: ["Only what you enter, synced to your account."],
    },
  ]}
/>;
```

For all 7 components above, styling works the same way as `ChangelogNotes`: an optional `styles` prop (all fields optional, neutral defaults), and where relevant an optional `labels` prop for the built-in French copy.

### Utils (`utils/helpers/`)

`confirmDestructive` is the only remaining util here — it wraps React Native's `Alert`, so it isn't framework-agnostic (see its own section above).

The framework-agnostic helpers that used to live here (`getPeriodStartMs`, `getMostRecentIds`, `nextInCycle`, `normalizeForSearch`, `rankByNameMatch`, `escapeCsvField`, `formatCsvNumber`, `escapeHtml`) moved to [`@forthtilliath/ts-kit`](../ts-kit#readme) — no React Native dependency on them, so they're usable from Node/web too. They're still re-exported from this package's root barrel for convenience:

```ts
import {
  getPeriodStartMs,
  getMostRecentIds,
} from "@forthtilliath/react-native-kit";
```

Prefer importing straight from `ts-kit` (deep import, see its README) if you don't otherwise need this package.

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

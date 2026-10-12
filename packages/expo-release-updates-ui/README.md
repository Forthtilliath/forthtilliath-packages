# @forthtilliath/expo-release-updates-ui

React Native UI for self-updating a sideloaded Android Expo app: release notes rendering, a dismissible "update available" banner, and a hook to check for updates once per mount. No opinion on your app's theme. Pairs with [`@forthtilliath/expo-release-updates`](../expo-release-updates#readme) (the framework-agnostic logic — checking GitHub releases, comparing versions, downloading the APK), kept in a separate package so that logic stays usable without pulling in React/React Native.

## Install

```bash
npm install @forthtilliath/expo-release-updates-ui @forthtilliath/expo-release-updates react react-native
```

Or, from within this monorepo, as a workspace dependency:

```json
{
  "dependencies": {
    "@forthtilliath/expo-release-updates-ui": "workspace:*"
  }
}
```

`react` and `react-native` are peer dependencies — install them in the consuming app if not already present.

## Usage

Each export is its own module — import the file you need directly, or use the barrel to pull everything from a single import:

```ts
import { ChangelogNotes } from "@forthtilliath/expo-release-updates-ui/ChangelogNotes";
import { UpdateAvailableBanner } from "@forthtilliath/expo-release-updates-ui/UpdateAvailableBanner";
import { useUpdateCheck } from "@forthtilliath/expo-release-updates-ui/useUpdateCheck";

// Or, everything at once:
import {
  ChangelogNotes,
  UpdateAvailableBanner,
  useUpdateCheck,
} from "@forthtilliath/expo-release-updates-ui";
```

### `useUpdateCheck(options)`

Checks once per mount (e.g. app launch) whether a newer release is available, throttled to at most one real check per `minIntervalMs` (default 12h) and silent for a release the user already dismissed. Has no opinion on where "when did we last check" / "which version did the user dismiss" are persisted — both are read/written entirely through the options you pass in.

```tsx
import { useUpdateCheck } from "@forthtilliath/expo-release-updates-ui";
import {
  compareVersions,
  fetchLatestRelease,
} from "@forthtilliath/expo-release-updates";

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

### `<UpdateAvailableBanner version notes onPress onDismiss />`

Dismissible banner announcing an available update: version, release notes (rendered via `ChangelogNotes`), an action button and a dismiss button. Has no opinion on what the action does (e.g. navigate to an update screen) or on how/whether dismissal is persisted.

```tsx
import { UpdateAvailableBanner } from "@forthtilliath/expo-release-updates-ui";

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

Built-in labels are French by default; pass `locale="en"` for English (e.g. from the app's language on a bilingual app). `labels` still overrides individual strings — `title`, `action`, `dismiss`, `dismissAccessibilityLabel` — whatever the locale.

### `<UpdateNotifier ... />` — the whole flow, install included

Mount it once near the root: it checks on launch (`useUpdateCheck`), shows the banner with **Install / Ignore**, and "Install" downloads the APK right away with a progress card — Android then asks for confirmation — instead of sending the user to an update screen. A failed download offers Retry / Close. "Ignore" calls `onDismissVersion` so that exact version is never announced again (a newer one will be).

```tsx
import { UpdateNotifier } from "@forthtilliath/expo-release-updates-ui/UpdateNotifier";

<View
  style={{ position: "absolute", top: 56, left: 16, right: 16, zIndex: 10 }}
>
  <UpdateNotifier
    enabled={settings !== undefined}
    currentVersion={Constants.expoConfig?.version ?? "0.0.0"}
    checkForUpdate={fetchLatestRelease}
    getLastCheck={() => ({
      lastCheckedAt: settings?.lastUpdateCheckAt ?? null,
      dismissedVersion: settings?.dismissedUpdateVersion ?? null,
    })}
    onChecked={(at) => recordUpdateCheck(at)}
    onDismissVersion={(version) => dismissUpdateVersion(version)}
    downloadAndInstallApk={(apkUrl, onProgress) =>
      downloadAndInstallApk({
        apkUrl,
        fileName: "myapp-update.apk",
        onProgress,
      })
    }
    styles={{ banner: { container: { backgroundColor: colors.surface } } }}
  />
</View>;
```

Pass **`enabled={false}` until the settings `getLastCheck` reads have loaded** (async database, live query…): the check runs once, on mount, so starting earlier would ignore both the 12h throttle and the dismissed version. Positioning is left to the parent. `labels` / `styles` take `{ banner, install }`, same keys as `UpdateAvailableBanner` and `UpdateInstallCard`.

The building blocks are exported too, to compose a different flow: `useApkInstall(downloadAndInstallApk)` (`{ state, start(version, apkUrl), retry, reset }`) and `<UpdateInstallCard state onRetry onClose />` (renders nothing while idle).

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

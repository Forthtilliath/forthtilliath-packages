# @forthtilliath/expo-release-updates

Self-update a sideloaded Android Expo app from its GitHub Releases: check the latest release, show a release history, download and trigger the install of a new APK. No backend needed — just a GitHub repo that publishes an `.apk` asset on each release.

## Install

```bash
npm install @forthtilliath/expo-release-updates expo-file-system expo-intent-launcher
```

Or, from within this monorepo, as a workspace dependency:

```json
{
  "dependencies": {
    "@forthtilliath/expo-release-updates": "workspace:*"
  }
}
```

`expo-file-system` and `expo-intent-launcher` are peer dependencies — install them in the consuming app if not already present.

## Usage

Each function is its own module — import the file you need directly, or use
the barrel to pull everything from a single import:

```ts
import { compareVersions } from "@forthtilliath/expo-release-updates/compareVersions";
import {
  fetchLatestRelease,
  fetchReleaseHistory,
} from "@forthtilliath/expo-release-updates/githubReleases";
import { downloadAndInstallApk } from "@forthtilliath/expo-release-updates/downloadAndInstallApk";
import { parseChangelogNotes } from "@forthtilliath/expo-release-updates/parseChangelogNotes";

// Or, everything at once:
import {
  compareVersions,
  fetchLatestRelease,
  fetchReleaseHistory,
  downloadAndInstallApk,
  parseChangelogNotes,
} from "@forthtilliath/expo-release-updates";
```

**Avoid the barrel under Jest (or any other CommonJS `require` consumer).**
`export * from` re-exports are evaluated eagerly on `require()` — unlike
Metro's ESM bundling, there's no tree-shaking to skip the unused ones.
Requiring the barrel from _any_ file, even one that only wants
`compareVersions`, pulls in `downloadAndInstallApk`'s module graph too,
including native-module imports (`expo-file-system`, `expo-intent-launcher`)
that don't exist in a Jest environment — this throws at require time, not
just at runtime for unused code. Deep imports only ever load the one module
you asked for, so they don't have this problem in any environment.

### `compareVersions(a, b)`

Compares two `"x.y.z"` version strings, segment by segment. Returns `-1` if `a < b`, `0` if equal, `1` if `a > b`.

```ts
compareVersions("1.2.0", "1.10.0"); // -1 (numeric, not lexicographic)
compareVersions("2.0.0", "1.9.9"); // 1
compareVersions("1.2.3", "1.2.3"); // 0
```

### `fetchLatestRelease({ owner, repo })`

Fetches the latest GitHub release and its `.apk` asset. Returns `null` if the latest release has no `.apk` attached; throws if the GitHub API request fails.

```ts
const release = await fetchLatestRelease({ owner: "acme", repo: "app" });
if (release && compareVersions(release.version, currentVersion) > 0) {
  // an update is available: release.version, release.notes, release.apkUrl
}
```

### `fetchReleaseHistory({ owner, repo, limit? })`

Fetches the most recent releases (version, notes, publish date), most recent first. `limit` defaults to `10` — useful for a "release history" / "what's new" screen.

```ts
const history = await fetchReleaseHistory({
  owner: "acme",
  repo: "app",
  limit: 5,
});
// [{ version: "1.11.0", notes: "### Added\n- ...", publishedAt: "2026-07-30T..." }, ...]
```

### `downloadAndInstallApk({ apkUrl, fileName, onProgress? })`

Downloads an APK to the app's cache directory and triggers the Android install-package intent. **Android only** — there is no iOS equivalent (sideloading isn't possible there).

```ts
await downloadAndInstallApk({
  apkUrl: release.apkUrl,
  fileName: "myapp-update.apk",
  onProgress: (fraction) => setProgress(fraction),
});
```

### `parseChangelogNotes(notes)`

Parses a small subset of Markdown (`### heading`, `- item`, `**bold**`) commonly found in GitHub release notes into a list of typed blocks (`heading` / `item` / `text`, each with `bold`-aware segments), ready for a UI layer to render without a full Markdown dependency. Pair it with `@forthtilliath/react-native-kit`'s `ChangelogNotes` component to render the result directly.

```ts
parseChangelogNotes("### Added\n- **Auto-backup**: saves every 5 minutes.");
// [
//   { type: "heading", text: "Added" },
//   {
//     type: "item",
//     segments: [
//       { text: "Auto-backup", bold: true },
//       { text: ": saves every 5 minutes.", bold: false },
//     ],
//   },
// ]
```

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

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

`expo-file-system` and `expo-intent-launcher` are **optional** peer dependencies, needed only by `downloadAndInstallApk` — install them in the consuming app if you use it (package managers won't add them for you). Release parsing and version comparison work without them.

## Usage

Each function is its own module — import the file you need directly, or use
the barrel to pull everything from a single import:

```ts
import { compareVersions } from "@forthtilliath/expo-release-updates/compareVersions";
import { isUpdateAvailable } from "@forthtilliath/expo-release-updates/isUpdateAvailable";
import {
  fetchLatestRelease,
  fetchReleaseHistory,
} from "@forthtilliath/expo-release-updates/githubReleases";
import { downloadAndInstallApk } from "@forthtilliath/expo-release-updates/downloadAndInstallApk";
import { parseChangelogNotes } from "@forthtilliath/expo-release-updates/parseChangelogNotes";

// Or, everything at once:
import {
  compareVersions,
  isUpdateAvailable,
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

### `isUpdateAvailable(currentVersion, latestVersion)`

Named wrapper around `compareVersions` for the common "should I show the update prompt?" check — reads as intent instead of a bare `compareVersions(a, b) > 0` repeated at every call site.

```ts
if (release && isUpdateAvailable(currentVersion, release.version)) {
  // an update is available
}
```

### `fetchLatestRelease({ owner, repo, includePrereleases?, token?, timeoutMs?, signal? })`

Fetches the latest GitHub release and its `.apk` asset: `{ version, notes, apkUrl, apkSha256? }`. `apkSha256` is the SHA-256 GitHub computed when the APK was uploaded — pass it to `downloadAndInstallApk`'s `expectedSha256`. Returns `null` if the latest release has no `.apk` attached; throws if the GitHub API request fails. Pass `token` for private repos, or to raise the API rate limit from 60 to 5000 requests/hour on public ones.

GitHub's `/releases/latest` only ever returns a **stable** release: an app that only publishes pre-releases (alpha, beta) would never see an update. Pass `includePrereleases: true` to scan the 10 most recent releases instead (drafts left out) and keep the highest version (semver, `1.0.0-alpha.10` > `1.0.0-alpha.2`) that carries an `.apk`.

The request gives up after `timeoutMs` (default `15000`) instead of hanging on a bad network, and can be cancelled with `signal` (an `AbortSignal`) — both also apply to `fetchReleaseHistory`.

> **Security — the token ships inside your app.** Anything bundled in an APK can be extracted from it, so treat the token as public: use a [fine-grained token](https://github.com/settings/personal-access-tokens) with **read-only "Contents" access to this one repository** and nothing else, never a classic token or one with write scopes. For a public repo, prefer no token at all.

```ts
const release = await fetchLatestRelease({ owner: "acme", repo: "app" });
if (release && isUpdateAvailable(currentVersion, release.version)) {
  // an update is available: release.version, release.notes, release.apkUrl
}
```

### `fetchReleaseHistory({ owner, repo, limit?, token?, timeoutMs?, signal? })`

Fetches the most recent published releases (version, notes, publish date), most recent first — draft releases, visible with a token, are left out. `limit` defaults to `10` (clamped to GitHub's 1–100) — useful for a "release history" / "what's new" screen.

```ts
const history = await fetchReleaseHistory({
  owner: "acme",
  repo: "app",
  limit: 5,
});
// [{ version: "1.11.0", notes: "### Added\n- ...", publishedAt: "2026-07-30T..." }, ...]
```

### `downloadAndInstallApk({ apkUrl, fileName, onProgress?, expectedSha256?, allowedUrlPrefix?, expectedMd5?, allowedHosts? })`

Downloads an APK to the app's cache directory and triggers the Android install-package intent. **Android only**. `apkUrl` must be an `https://` URL on one of `allowedHosts` (default `["github.com"]`, where `fetchLatestRelease`'s `apkUrl` points) — anything else throws before downloading.

Recommended checks, both fed by `fetchLatestRelease`:

- **`allowedUrlPrefix: releaseDownloadUrlPrefix({ owner, repo })`** — only an APK of _this_ repo's releases (`https://github.com/<owner>/<repo>/releases/download/…`): `allowedHosts` alone accepts any github.com URL, another repo's included. After the prefix, only plain path segments pass (no `..`, query, fragment or `%`-escape).
- **`expectedSha256: release.apkSha256`** — the downloaded file must match the SHA-256 GitHub computed on upload; a mismatch deletes it and throws. Computed natively with `File#digest`, so it needs **expo-file-system 58 or later** (with an older one, it throws rather than skip the check).

`expectedMd5` remains for a checksum you publish yourself (release notes, `.md5` asset).

What a checksum does and doesn't protect against:

- ✅ a corrupted, truncated or swapped download;
- ❌ a malicious release — whoever can publish the APK can publish its checksum too. The real safeguard there is Android itself: it refuses to install an update that isn't signed with the same key as the installed app. **Keep that signing key out of the repo and CI logs**, and restrict who can publish releases.

```ts
const repo = { owner: "acme", repo: "app" };
const release = await fetchLatestRelease(repo);
if (release) {
  await downloadAndInstallApk({
    apkUrl: release.apkUrl,
    fileName: "myapp-update.apk",
    onProgress: (fraction) => setProgress(fraction),
    allowedUrlPrefix: releaseDownloadUrlPrefix(repo),
    expectedSha256: release.apkSha256,
  });
}
```

### `parseChangelogNotes(notes)`

Parses a small subset of Markdown (`### heading`, `- item`, `**bold**`) commonly found in GitHub release notes into a list of typed blocks (`heading` / `item` / `text`, each with `bold`-aware segments), ready for a UI layer to render without a full Markdown dependency. Pair it with `@forthtilliath/expo-release-updates-ui`'s `ChangelogNotes` component to render the result directly.

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

---
"@forthtilliath/expo-release-updates": minor
---

Added `token` to `GithubRepoRef` (sent as a `Bearer` header on `fetchLatestRelease`/`fetchReleaseHistory`) for private repos and higher GitHub API rate limits, `expectedMd5` to `downloadAndInstallApk` to verify the downloaded APK's integrity before installing it, and `isUpdateAvailable(current, latest)` as a named wrapper around `compareVersions`.

---
"@forthtilliath/expo-release-updates": minor
---

`downloadAndInstallApk` now refuses an `apkUrl` that isn't `https://` on one of the new `allowedHosts` option (default `["github.com"]`, where `fetchLatestRelease`'s `apkUrl` points), before downloading anything. Breaking if your APKs are hosted elsewhere: pass that host in `allowedHosts`.

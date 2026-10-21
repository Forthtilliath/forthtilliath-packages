---
"@forthtilliath/expo-release-updates": minor
"@forthtilliath/expo-release-updates-ui": minor
"@forthtilliath/react-native-kit": minor
---

expo-release-updates: `fetchLatestRelease` returns the APK's `apkSha256` (computed by GitHub) and takes `includePrereleases`; `downloadAndInstallApk` takes `expectedSha256` (needs expo-file-system 58+) and `allowedUrlPrefix`, with `releaseDownloadUrlPrefix({ owner, repo })` to restrict installs to the repo's own releases. GitHub responses are checked field by field. expo-release-updates-ui (`UpdateNotifier`, `useApkInstall`) and react-native-kit (`UpdateSettingsScreen`) hand `apkSha256` to `downloadAndInstallApk` as a third argument.

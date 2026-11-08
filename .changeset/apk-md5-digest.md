---
"@forthtilliath/expo-release-updates": patch
---

`downloadAndInstallApk`: `expectedMd5` is checked with `File#digest("MD5")` on expo-file-system 58, instead of the deprecated `info({ md5: true })` (still used on older versions).

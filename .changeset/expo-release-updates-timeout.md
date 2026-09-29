---
"@forthtilliath/expo-release-updates": minor
---

`fetchLatestRelease` / `fetchReleaseHistory`: requests now give up after `timeoutMs` (default 15 s) instead of hanging on a bad network, and accept a `signal` to cancel them. `fetchReleaseHistory` leaves draft releases out and clamps `limit` to GitHub's 1–100 range. The README now warns that a `token` bundled in an app can be extracted from the APK, and clarifies that `expectedMd5` catches a corrupted download, not a malicious release.

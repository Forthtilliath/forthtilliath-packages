---
"@forthtilliath/expo-release-updates": minor
---

`fetchLatestRelease` takes `requireVerifiedApk`: an `.apk` without a SHA-256, or outside the repo's release URLs, is skipped (the next highest version wins with `includePrereleases`), so nothing is offered that `downloadAndInstallApk` with `expectedSha256` + `allowedUrlPrefix` would refuse. GitHub's answer is now bounded too: release notes are cut at 100,000 characters, an oversized tag, asset name or URL counts as missing, and a release without a tag is ignored.

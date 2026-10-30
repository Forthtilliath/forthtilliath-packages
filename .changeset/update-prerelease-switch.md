---
"@forthtilliath/react-native-kit": minor
---

`UpdateSettingsScreen` takes `includePrereleases` and `onIncludePrereleasesChange`: with the latter, a "Recevoir les versions de test" switch is shown, and every change checks again (an older check answering late is ignored). `checkForUpdate` now receives `{ includePrereleases }`, to pass on to `fetchLatestRelease`. New `prereleaseLabel` / `prereleaseDescription` labels and `prereleaseSwitch` / `prereleaseSwitchColors` styles.

---
"@forthtilliath/expo-config-plugins": minor
---

`withReleaseRemovedPermissions` strips permissions from the release APK only — `INTERNET` by default, so an offline app can't send anything off the phone whatever a dependency tries — through a generated `src/release/AndroidManifest.xml`. Debug builds keep them; a release manifest it didn't generate is never overwritten, and only permission names are accepted.

---
"@forthtilliath/expo-config-plugins": minor
---

`withShortCxxPath` takes a `cmakeVersion` option (e.g. `"4.1.2"`) that pins a recent CMake for `:app`: on Windows with Gesture Handler 3 / Reanimated 4.7, the default CMake 3.22 still overflows the path limit even in `C:/rncxx`.

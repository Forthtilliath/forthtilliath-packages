---
"@forthtilliath/react-native-kit": minor
---

New `utils/files/appFiles`: keep picked photos in a persistent sub-folder of the app's documents (`persistFile`, `getAppDirectory`), delete them without ever throwing (`deleteFileQuietly`, `fileExists`) and clean up orphans (`pruneAppDirectory`). Extracted from GlucoDose and 7 Wonders Assistant.

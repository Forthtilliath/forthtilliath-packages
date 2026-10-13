---
"@forthtilliath/react-native-kit": minor
---

New `utils/files/appFiles`: keep picked photos in a persistent sub-folder of the app's documents (`persistFile`, `getAppDirectory`), delete them without ever throwing (`deleteFileQuietly`, `fileExists`) and clean up orphans (`pruneAppDirectory`, matching files by name so a URI stored with another form of the app data path never gets its file deleted). Folder names, prefixes and extensions are restricted to plain name characters, so data from an imported backup can't write outside the folder. Extracted from GlucoDose and 7 Wonders Assistant.

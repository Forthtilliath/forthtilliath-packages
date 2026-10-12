---
"@forthtilliath/react-native-kit": patch
---

`PhotoPicker` no longer requests the media library permission before opening the library: the system photo picker needs none, so apps can now block the storage permissions (`READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `READ_MEDIA_IMAGES`). The `libraryPermissionTitle` / `libraryPermissionMessage` labels are deprecated and unused.

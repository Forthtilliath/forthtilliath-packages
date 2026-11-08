---
"@forthtilliath/expo-backup": patch
---

Wait for `File.write` on expo-file-system 58, where it returns a promise: the safety backup is on disk before a restore replaces the data (a failed write now stops the restore), and an export is shared only once fully written.

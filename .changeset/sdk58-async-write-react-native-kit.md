---
"@forthtilliath/react-native-kit": patch
---

Wait for `File.write` on expo-file-system 58, where it returns a promise: `shareTextFile` shares the file only once written, and `writeBase64File` uses `writeSync` so the file exists when its URI is returned.

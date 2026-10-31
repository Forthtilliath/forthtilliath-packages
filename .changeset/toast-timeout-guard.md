---
"@forthtilliath/react-native-kit": patch
---

`ToastHost` keeps the delay asked for unless Android's accessibility setting returns a longer finite one: a mock answering `false` (React Native's Jest preset) or any other value no longer hides the toast at once.

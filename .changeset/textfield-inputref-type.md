---
"@forthtilliath/react-native-kit": patch
---

`TextField`'s `inputRef` is typed `Ref<ComponentRef<typeof TextInput>>`, so `useRef<ComponentRef<typeof TextInput>>` works without a cast under React Native 0.88 (where `TextInput` is a function component).

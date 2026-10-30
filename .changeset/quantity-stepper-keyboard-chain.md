---
"@forthtilliath/react-native-kit": minor
---

`QuantityStepper` takes `inputRef`, `onSubmitEditing` and `returnKeyType`, to chain steppers on the keyboard's Enter key: the typed value is sent first, then `onSubmitEditing` runs (e.g. focusing the next stepper through its `inputRef`), with the keyboard kept open and an Enter key reading "next" by default.

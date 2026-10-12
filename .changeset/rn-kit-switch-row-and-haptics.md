---
"@forthtilliath/react-native-kit": minor
---

New `SwitchRow` (`components/settings/`): a fully pressable "label + description + switch" line, announced as one switch. New `utils/helpers/haptics` (`tapFeedback`, `selectFeedback`, `successFeedback`, `errorFeedback`), fire-and-forget aliases over `expo-haptics`, a new optional peer dependency. `SegmentedToggle` is now announced as a radio group (`label` prop, options as radios) and options take an optional `hint` line (`hint` / `hintActive` style slots). `QuantityStepper` gains `min` (default 0) and `longPressStep`, and disables "+" at `max`.

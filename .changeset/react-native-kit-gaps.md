---
"@forthtilliath/react-native-kit": minor
---

`QuantityStepper` takes `maxFontSizeMultiplier`, applied to "−", "+" and the field. `PhotoPicker` takes `onOpen`, called when a press opens the camera/library choice (e.g. a haptic tick). `shareViewAsImage` now types its ref as `RefObject<ComponentRef<typeof View> | null>`, which a `<View ref>` ref matches without a cast. New `useViewShare` hook: shares as an image a view mounted only for the capture (`capturing`), waiting two frames before capturing, with an error alert or `onError`.

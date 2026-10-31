---
"@forthtilliath/react-native-kit": patch
---

`useViewShare` declares its result (`UseViewShareResult`): `ref` is typed `RefObject<ComponentRef<typeof View> | null>` in the published types, instead of `RefObject<View | null>` inferred from React Native 0.86's types, where `View` was the instance. Under React Native 0.88 `View` is the component, so `<View ref={ref}>` failed to type-check without a cast.

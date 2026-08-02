---
"@forthtilliath/react-native-kit": minor
---

Fix `PickerModal`'s `styles.iconColor` being shared between the "add" extra-action icon and the row thumbnail placeholder icon, even when both a distinct primary color and a muted color are wanted for each. Split into `extraActionIconColor` and `rowThumbnailPlaceholderIconColor`. Breaking rename, but `iconColor` had no consumer yet.

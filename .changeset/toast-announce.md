---
"@forthtilliath/react-native-kit": patch
---

`ToastHost` announces each toast to TalkBack with `announceForAccessibility` instead of a live region, which TalkBack doesn't always read for a view that just appeared.

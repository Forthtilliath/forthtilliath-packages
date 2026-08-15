---
"@forthtilliath/react-native-kit": minor
---

`BackupSettingsScreen`, `ContactSettingsScreen`, `AboutSettingsScreen`, and `SettingsMenu` (`components/settings/`) now cover a few more real-world shapes so apps with more involved settings screens don't have to fall back to custom code: `BackupSettingsScreen` gains an `info` box, a `layout="sections"` stacked variant, and leading button `icons`; `ContactSettingsScreen` gains an `actions` list for extra rows (share, rate the app...) alongside the email; `AboutSettingsScreen` gains extra titled `sections` (e.g. a medical/legal disclaimer) and makes `developerName` optional; `SettingsMenu` gains a `groups` prop as an alternative to flat `items`, for rows grouped under optional section headers.

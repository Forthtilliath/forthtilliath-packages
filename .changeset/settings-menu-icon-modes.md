---
"@forthtilliath/react-native-kit": minor
---

`SettingsMenu` and `ThemeSettingsScreen` (`components/settings/`) now support a second, denser visual: `Ionicons` glyphs in one shared color instead of colorful emoji (`SettingsMenu`'s `defaultIconKind`/item-level `icon`, `ThemeSettingsScreen`'s `variant="icon"`), and hiding descriptive text altogether (`SettingsMenu`'s `showHints`, `ThemeSettingsScreen`'s `showHint`). `SettingsMenu` items also get a default icon/emoji for free when their `key` matches one of the 6 built-in sections (`backup`/`theme`/`update`/`about`/`contact`/`privacy`) — no `emoji`/`icon` needed unless you want to override it.

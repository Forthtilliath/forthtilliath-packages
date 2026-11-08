---
"@forthtilliath/ts-kit": minor
"@forthtilliath/expo-release-updates-ui": minor
---

`parseChangelogNotes` now understands `> ` quotes (new `quote` block: a `switch` over `block.type` must handle it), `* ` items, `*italic*` / `_italic_` and `` `code` `` (segments get `italic: true` / `code: true` when set). `ChangelogNotes` renders them (new `quote`, `quoteText`, `italic`, `code` styles), and `UpdateAvailableBanner` puts the notes in a `ScrollView` capped at 200 px (`styles.notesScroll`), so long notes no longer push the buttons out of the card.

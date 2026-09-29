---
"@forthtilliath/ts-kit": patch
---

Bug fixes:

- `deepEqual`: `Date`s (by timestamp), `RegExp`s, `Map`s and `Set`s are now actually compared (they were always equal, having no own keys); a key missing from the other object is no longer treated as `undefined` (`{ a: undefined }` vs `{ b: undefined }` was `true`); values with different prototypes are no longer equal.
- `compareVersions`: follows semver precedence for pre-releases (`1.0.0-beta.2` < `1.0.0-beta.10` < `1.0.0`) instead of returning `-1` both ways; ignores a leading `v` and build metadata.
- `formatBytes`: a fraction of a byte is formatted in `B` (was `"512 undefined"` for `0.5`), and `decimals: 0` no longer strips the integer part's zeros (`formatBytes(100, 0)` was `"1 B"`).

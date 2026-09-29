---
"@forthtilliath/test-kit": minor
"@forthtilliath/expo-release-updates-ui": patch
"@forthtilliath/expo-test-kit": patch
---

- `test-kit`: `createMockResponse` returns a real `Response` (full API, assignable to `Response`) instead of a partial look-alike. **Behavior changes**: `ok` follows the real rule (a 3xx is no longer `ok` unless forced with `{ ok: true }`), and `json()` on a string body now parses it (it used to return the raw string). The `MockResponse` type is deprecated (alias of `Response`).
- `expo-release-updates-ui`: `UpdateCheckRelease` is now an alias of `expo-release-updates`' `LatestRelease` instead of a duplicate, and `useUpdateCheck`'s `compareVersions` is optional (defaults to `expo-release-updates`' semver comparison).
- `expo-test-kit`: tests now check that foreign keys are also enforced inside transactions (they are: libsql enables them by default on every connection).

# @forthtilliath/ts-kit

## 0.7.0

### Minor Changes

- e2d621a: Add `swapItems(items, i, j)` to the `array` category: returns a copy of `items` with the elements at `i` and `j` swapped, or a plain copy if either position is out of bounds.

## 0.6.0

### Minor Changes

- 9d0e8c6: New package `@forthtilliath/r2`: direct browser-to-bucket uploads for Cloudflare R2 (or any S3-compatible storage) via presigned URLs — `uploadViaPresignedUrl` (`./client`, dependency-free), `createR2Client`, `createPresignHandler` (a Fetch API `Request → Response` route handler with an `authorize` hook) and `isSafeKey` (`./server`, AWS SDK as peer dependencies), plus the shared `PresignRequest`/`PresignResponse` types at the root. Extracted from the Chœur des Anjoués site. `ts-kit` gains an `image` category with `compressImage` (browser-side Canvas resize + WebP conversion), extracted from the same project.

## 0.5.0

### Minor Changes

- 05f2fa3: Moved `compareVersions` (new `version/` category) and `parseChangelogNotes` (new `markdown/` category) from `@forthtilliath/expo-release-updates` into `@forthtilliath/ts-kit` — both were 100% framework-agnostic. `expo-release-updates` now re-exports them from `ts-kit`, so its public API (root barrel and `@forthtilliath/expo-release-updates/compareVersions` / `.../parseChangelogNotes` deep imports) is unchanged.

## 0.4.0

### Minor Changes

- 2932cc7: Added `escapeCsvField`/`escapeHtml`/`normalizeForSearch` to `string`, `formatCsvNumber` to `number`, `getMostRecentIds`/`nextInCycle`/`rankByNameMatch` to `array`, and `getPeriodStartMs` to `date`. All are exported from the root barrel and from their own `@forthtilliath/ts-kit/<category>` subpath. Extracted from `@forthtilliath/react-native-kit`, which had no React Native dependency on them.

## 0.3.0

### Minor Changes

- e069c34: Added `object` (`pick`, `omit`, `groupBy`, `uniqueBy`, `deepClone`, `deepEqual`, `mapValues`), `string` (`capitalize`, `truncate`, `slugify`, `pluralize`), `async` (`sleep`, `retry`, `debounce`, `throttle`, `memoize`, `withTimeout`), `date` (`startOfDay`, `isSameDay`, `formatRelativeTime`) and `number` (`clamp`, `round`, `formatBytes`, `formatDuration`) categories. Added a root barrel (`import { chunk, pick, sleep } from "@forthtilliath/ts-kit"`) so consumers no longer need one import per sub-module. `FArray` gained `indexOf`/`lastIndexOf` (accept a search value outside of the element type, like `includes`), a `filter(Boolean)` overload that strips `null`/`undefined` from the result's type, `FArray.from`/`FArray.of` static overrides typed to return `FArray` instead of a plain array, and `toArray()` to convert back to a plain `Array`.

## 0.2.0

### Minor Changes

- 0b0c639: Added `randomId` (`crypto.randomUUID()` with a fallback for older/insecure contexts). `downloadTextBlob` now accepts an optional `mimeType` parameter (defaults to `"text/plain"`) and appends `;charset=utf-8` to the blob type.

## 0.1.0

### Minor Changes

- 5ea7fd8: First release. Renamed from `@forthtilliath/lib` to mirror `@forthtilliath/react-native-kit`/`@forthtilliath/react-kit`'s naming — no code changes.

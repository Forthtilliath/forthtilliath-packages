# @forthtilliath/ts-kit

## 0.3.0

### Minor Changes

- e069c34: Added `object` (`pick`, `omit`, `groupBy`, `uniqueBy`, `deepClone`, `deepEqual`, `mapValues`), `string` (`capitalize`, `truncate`, `slugify`, `pluralize`), `async` (`sleep`, `retry`, `debounce`, `throttle`, `memoize`, `withTimeout`), `date` (`startOfDay`, `isSameDay`, `formatRelativeTime`) and `number` (`clamp`, `round`, `formatBytes`, `formatDuration`) categories. Added a root barrel (`import { chunk, pick, sleep } from "@forthtilliath/ts-kit"`) so consumers no longer need one import per sub-module. `FArray` gained `indexOf`/`lastIndexOf` (accept a search value outside of the element type, like `includes`), a `filter(Boolean)` overload that strips `null`/`undefined` from the result's type, `FArray.from`/`FArray.of` static overrides typed to return `FArray` instead of a plain array, and `toArray()` to convert back to a plain `Array`.

## 0.2.0

### Minor Changes

- 0b0c639: Added `randomId` (`crypto.randomUUID()` with a fallback for older/insecure contexts). `downloadTextBlob` now accepts an optional `mimeType` parameter (defaults to `"text/plain"`) and appends `;charset=utf-8` to the blob type.

## 0.1.0

### Minor Changes

- 5ea7fd8: First release. Renamed from `@forthtilliath/lib` to mirror `@forthtilliath/react-native-kit`/`@forthtilliath/react-kit`'s naming — no code changes.

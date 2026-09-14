---
"@forthtilliath/ts-kit": minor
---

Added `object` (`pick`, `omit`, `groupBy`, `uniqueBy`, `deepClone`, `deepEqual`, `mapValues`), `string` (`capitalize`, `truncate`, `slugify`, `pluralize`), `async` (`sleep`, `retry`, `debounce`, `throttle`, `memoize`, `withTimeout`), `date` (`startOfDay`, `isSameDay`, `formatRelativeTime`) and `number` (`clamp`, `round`, `formatBytes`, `formatDuration`) categories. Added a root barrel (`import { chunk, pick, sleep } from "@forthtilliath/ts-kit"`) so consumers no longer need one import per sub-module. `FArray` gained `indexOf`/`lastIndexOf` (accept a search value outside of the element type, like `includes`), a `filter(Boolean)` overload that strips `null`/`undefined` from the result's type, `FArray.from`/`FArray.of` static overrides typed to return `FArray` instead of a plain array, and `toArray()` to convert back to a plain `Array`.

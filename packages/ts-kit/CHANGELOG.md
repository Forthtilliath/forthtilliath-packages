# @forthtilliath/ts-kit

## 0.2.0

### Minor Changes

- 0b0c639: Added `randomId` (`crypto.randomUUID()` with a fallback for older/insecure contexts). `downloadTextBlob` now accepts an optional `mimeType` parameter (defaults to `"text/plain"`) and appends `;charset=utf-8` to the blob type.

## 0.1.0

### Minor Changes

- 5ea7fd8: First release. Renamed from `@forthtilliath/lib` to mirror `@forthtilliath/react-native-kit`/`@forthtilliath/react-kit`'s naming — no code changes.

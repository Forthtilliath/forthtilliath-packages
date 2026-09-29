---
"@forthtilliath/ts-kit": patch
"@forthtilliath/ts-types": patch
"@forthtilliath/react-kit": patch
"@forthtilliath/react-native-kit": patch
"@forthtilliath/expo-release-updates": patch
"@forthtilliath/expo-release-updates-ui": patch
"@forthtilliath/r2": patch
"@forthtilliath/forth-ui": patch
"@forthtilliath/shadcn-ui": patch
---

Declare `sideEffects` (`false`, or `["*.css"]` for `forth-ui`/`shadcn-ui`) so bundlers can tree-shake unused modules, root barrels included. Internal dependencies are now published as caret ranges (`^0.4.0`) instead of exact versions.

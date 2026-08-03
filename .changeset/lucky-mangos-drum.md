---
"@forthtilliath/react-native-kit": minor
---

Add a root barrel export (`import { X, Y } from "@forthtilliath/react-native-kit"`) alongside the existing deep-import paths, for callers importing several exports at once who don't mind the peer-dependency-bundling trade-off (see README). Deep imports remain the recommended default.

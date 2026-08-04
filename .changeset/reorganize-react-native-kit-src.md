---
"@forthtilliath/react-native-kit": minor
---

Reorganized `src/` into `components/{picker,theme,update,list}/`, `hooks/`, and `utils/{format,helpers}/` subfolders. Deep-import paths change accordingly, e.g. `@forthtilliath/react-native-kit/PickerModal` becomes `@forthtilliath/react-native-kit/components/picker/PickerModal`, `@forthtilliath/react-native-kit/useSubmitGuard` becomes `@forthtilliath/react-native-kit/hooks/useSubmitGuard`, and `@forthtilliath/react-native-kit/utils/escapeCsvField` becomes `@forthtilliath/react-native-kit/utils/format/escapeCsvField`. The root barrel import (`import { X } from "@forthtilliath/react-native-kit"`) is unaffected. See the README for the full list of new paths.

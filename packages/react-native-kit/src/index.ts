// Convenience barrel re-exporting everything below one import path. Deep
// imports (`@forthtilliath/react-native-kit/components/picker/PickerModal`,
// etc.) remain the recommended default for apps that want to avoid pulling in
// peer deps they don't have installed (Metro doesn't reliably tree-shake) —
// see the README.
export * from "./components/list/ColorDot.js";
export * from "./components/list/SwipeableRow.js";
export * from "./components/list/Thumbnail.js";
export * from "./components/list/UndoToast.js";
export * from "./components/picker/PhotoPicker.js";
export * from "./components/picker/PickerModal.js";
export * from "./components/picker/VoiceSearchButton.js";
export * from "./components/settings/AboutSettingsScreen.js";
export * from "./components/settings/BackupSettingsScreen.js";
export * from "./components/settings/ContactSettingsScreen.js";
export * from "./components/settings/PrivacySettingsScreen.js";
export * from "./components/settings/SettingsMenu.js";
export * from "./components/settings/ThemeSettingsScreen.js";
export * from "./components/settings/UpdateSettingsScreen.js";
export * from "./components/theme/ThemeOptionList.js";
export * from "./components/theme/ThemeToggle.js";
export * from "./hooks/useDebouncedChange.js";
export * from "./hooks/useEffectiveColorScheme.js";
export * from "./hooks/useSubmitGuard.js";
export * from "./utils/helpers/confirmDestructive.js";
// Framework-agnostic — actually implemented (and tested/documented) in
// ts-kit, re-exported here so existing imports of these names keep working.
export {
  getMostRecentIds,
  type RecentIdRow,
} from "@forthtilliath/ts-kit/array/getMostRecentIds";
export { nextInCycle } from "@forthtilliath/ts-kit/array/nextInCycle";
export { rankByNameMatch } from "@forthtilliath/ts-kit/array/rankByNameMatch";
export {
  getPeriodStartMs,
  type PeriodFilter,
} from "@forthtilliath/ts-kit/date/getPeriodStartMs";
export { formatCsvNumber } from "@forthtilliath/ts-kit/number/formatCsvNumber";
export { escapeCsvField } from "@forthtilliath/ts-kit/string/escapeCsvField";
export { escapeHtml } from "@forthtilliath/ts-kit/string/escapeHtml";
export { normalizeForSearch } from "@forthtilliath/ts-kit/string/normalizeForSearch";

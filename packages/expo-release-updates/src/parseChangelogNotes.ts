// Framework-agnostic — actually implemented (and tested/documented) in
// ts-kit, re-exported here so this package's deep-import path
// (`@forthtilliath/expo-release-updates/parseChangelogNotes`) and root
// barrel export keep working.
export type {
  ChangelogBlock,
  ChangelogSegment,
} from "@forthtilliath/ts-kit/markdown/parseChangelogNotes";
export { parseChangelogNotes } from "@forthtilliath/ts-kit/markdown/parseChangelogNotes";

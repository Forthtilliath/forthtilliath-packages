// Shared locations of the visual run (see vitest.visual.config.ts).
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const rootDir = join(dirname(fileURLToPath(import.meta.url)), "../..");
export const visualDir = join(rootDir, "visual");
export const baselineDir = join(visualDir, "baseline");
export const diffDir = join(visualDir, "diff");
export const attachmentsDir = join(visualDir, "attachments");
export const reportFile = join(visualDir, "report.html");

/**
 * Screenshot files of a story, as taken by .storybook/visual.ts (`<id>` and
 * `<id>--dark`) once Vitest has sanitized the names: runs of dashes are
 * collapsed (`button--primary` → `button-primary`).
 */
export function variantsOf(storyId) {
  const sanitize = (name) => name.replace(/-{2,}/g, "-");
  return [
    { label: "Clair", file: sanitize(storyId) },
    { label: "Sombre", file: sanitize(`${storyId}--dark`) },
  ];
}

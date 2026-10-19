// Vitest reporter of the visual run (vitest.visual.config.ts): sorts the
// failed stories (render changed, new reference, unstable, other error),
// prints the list and writes visual/report.html to review and accept them.
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { renderReport } from "./report-html.mjs";
import {
  attachmentsDir,
  diffDir,
  reportFile,
  rootDir,
  variantsOf,
} from "./paths.mjs";

export default class VisualReporter {
  onInit() {
    // Diffs of a previous run would show up as changes of this one.
    rmSync(diffDir, { recursive: true, force: true });
    rmSync(attachmentsDir, { recursive: true, force: true });
  }

  onTestRunEnd(testModules, unhandledErrors) {
    const groups = { changed: [], created: [], unstable: [], errors: [] };
    // Nothing ran (setup failure…): never report it as "no change".
    if (!testModules.some((m) => [...m.children.allTests()].length)) {
      console.log(
        "\n─── Rendu visuel ───\nAucune story testée : voir les erreurs plus haut.",
      );
      process.exitCode = 1;
      return;
    }
    for (const error of unhandledErrors) {
      groups.errors.push({
        name: "Erreur hors story",
        file: "",
        message: error.message,
      });
    }

    for (const module of testModules) {
      for (const test of module.children.allTests()) {
        const result = test.result();
        const storyId = test.meta().storyId;
        // A test passed on retry keeps the errors of its failed try.
        const message = (result.errors ?? []).map((e) => e.message).join("\n");
        const isNew = message.includes("a new one was created");
        const variants = storyId ? variantsOf(storyId) : [];
        const entry = {
          storyId,
          // Area covered by the story, measured by .storybook/visual.ts.
          box: test.meta().visualBox,
          name: test.fullName,
          file: relative(rootDir, module.moduleId).replaceAll("\\", "/"),
          message,
          variants,
          changedVariants: variants
            .filter((v) => existsSync(join(diffDir, `${v.file}-actual.png`)))
            // No diff image when the size changed (pixelmatch can't compare).
            .map((v) => ({
              ...v,
              hasDiff: existsSync(join(diffDir, `${v.file}-diff.png`)),
            })),
        };

        if (result.state !== "failed") {
          // Its first try created the reference, the retry matched it.
          if (isNew) groups.created.push(entry);
          // Passed on retry: drop the diff of the failed try, or
          // `test:visual:accept --all` would take it.
          if (storyId) removeDiffs(storyId);
        } else if (entry.changedVariants.length) groups.changed.push(entry);
        else if (isNew) groups.created.push(entry);
        else if (message.includes("stable screenshot"))
          groups.unstable.push(entry);
        else groups.errors.push(entry);
      }
    }

    writeFileSync(reportFile, renderReport(groups));
    printSummary(groups);
  }
}

function removeDiffs(storyId) {
  for (const { file } of variantsOf(storyId)) {
    for (const suffix of ["actual", "diff", "reference"]) {
      rmSync(join(diffDir, `${file}-${suffix}.png`), { force: true });
    }
  }
}

function printSummary({ changed, created, unstable, errors }) {
  const line = (label, list) => {
    if (!list.length) return;
    console.log(`\n${label} (${list.length}) :`);
    for (const { storyId, name } of list) console.log(`  - ${storyId ?? name}`);
  };
  console.log("\n─── Rendu visuel ───");
  if (
    !changed.length &&
    !created.length &&
    !unstable.length &&
    !errors.length
  ) {
    console.log("Aucun changement de rendu.");
    return;
  }
  line("Rendu modifié", changed);
  line("Nouvelles références (à relire)", created);
  line("Capture instable", unstable);
  line("Autres erreurs", errors);
  console.log(`\nRapport : ${reportFile}`);
  if (changed.length) {
    console.log(
      "Accepter : pnpm --filter react-sb test:visual:accept <storyId…> (ou --all)",
    );
  }
}

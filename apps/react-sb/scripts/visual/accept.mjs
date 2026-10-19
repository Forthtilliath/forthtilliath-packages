// Accepts render changes found by `test:visual`: the new screenshots of the
// given stories become their references.
//
// Usage: pnpm --filter react-sb test:visual:accept <storyId…> | --all
import { copyFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import { baselineDir, diffDir, variantsOf } from "./paths.mjs";

const args = process.argv.slice(2);
if (!args.length) {
  console.error("Usage: test:visual:accept <storyId…> | --all");
  process.exit(1);
}

const pending = (file) => existsSync(join(diffDir, `${file}-actual.png`));

function accept(file) {
  copyFileSync(
    join(diffDir, `${file}-actual.png`),
    join(baselineDir, `${file}.png`),
  );
  for (const suffix of ["actual", "diff", "reference"]) {
    rmSync(join(diffDir, `${file}-${suffix}.png`), { force: true });
  }
  console.log(`  ✓ ${file}`);
}

let accepted = 0;
if (args.includes("--all")) {
  const files = (existsSync(diffDir) ? readdirSync(diffDir) : [])
    .filter((f) => f.endsWith("-actual.png"))
    .map((f) => f.slice(0, -"-actual.png".length));
  files.forEach(accept);
  accepted = files.length;
} else {
  for (const storyId of args) {
    const files = variantsOf(storyId)
      .map((v) => v.file)
      .filter(pending);
    if (!files.length)
      console.warn(`  ? ${storyId} : aucun changement en attente`);
    files.forEach(accept);
    accepted += files.length;
  }
}
console.log(`${accepted} capture(s) acceptée(s).`);

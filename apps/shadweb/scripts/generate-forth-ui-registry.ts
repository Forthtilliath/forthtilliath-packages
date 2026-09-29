/**
 * Generates `apps/shadweb/registry/forth-ui/**` (rewritten, registry-flavored
 * copies of `packages/react/forth-ui/src/components/**`) and the `items`
 * array of `apps/shadweb/registry.json`, ready for `shadcn build`.
 *
 * `packages/react/forth-ui/src/components/**` stays the single source of
 * truth — never hand-edit the generated `registry/forth-ui/**` output.
 *
 * Import-rewrite rules (only the string literal, never the imported names),
 * applied after stripping relative `.js`/`/index.js` extensions:
 *   @forthtilliath/shadcn-ui/components/X  -> @/components/ui/X   (+ bare registryDependency "X")
 *   @forthtilliath/shadcn-ui/lib/utils     -> @/lib/utils
 *   @forthtilliath/shadcn-ui/hooks/X       -> @/hooks/X
 *   ../other-forth-ui-component            -> @/components/forth-ui/other-forth-ui-component
 *                                              (+ namespaced registryDependency "@forth-ui/other-forth-ui-component")
 *   ../../locale/X                         -> @/components/forth-ui/locale/X
 *                                              (+ namespaced registryDependency "@forth-ui/locale")
 *   ./same-folder-sibling                  -> left untouched (lands in the same target subfolder)
 *   bare npm specifiers (qrcode, lucide-react, class-variance-authority, ...) -> left untouched,
 *     recorded into the item's own `dependencies`/`devDependencies` listed in
 *     `forth-ui-registry/components.json` (with each item's title and description).
 *
 * `grid` is deliberately excluded: it imports `@forthtilliath/react-kit/useKeyListener`
 * (a real runtime hook) and `@forthtilliath/ts-types/object` (a type-only utility) — both
 * external npm packages. Registry-izing it needs those inlined as
 * `registry:hook`/local-type files first; not done yet, see UPGRADE.md.
 *
 * KNOWN LIMITATION — `accordion`: this monorepo's vendored
 * `packages/react/shadcn-ui/src/components/accordion.tsx` has a local
 * customization (`hideChevron`/`customChevron` on `AccordionTrigger`) not
 * present in the official upstream shadcn `accordion` registry item.
 * `accordion-items.tsx` uses those props directly against the *official*
 * `AccordionTrigger` once installed via a registry consumer (the bare
 * `registryDependencies: ["accordion"]` this script auto-detects always
 * resolves to upstream, never to this repo's fork) — so a registry
 * consumer gets a type error on those two props specifically. Every other
 * prop/behavior works. Verified against both Base UI and Radix base
 * libraries — not a base-library mismatch, a genuine vendored-primitive
 * divergence. Not fixed here; needs either bundling the customized
 * AccordionTrigger as one of forth-ui's own registry files (like the
 * cross-component-dependency case) or dropping reliance on the two props
 * in `accordion-items.tsx`.
 *
 * Run: `pnpm run registry:generate` (from apps/shadweb).
 */
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { transformSource } from "./forth-ui-registry/transform";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const SHADWEB_ROOT = join(scriptDir, "..");
const FORTH_UI_SRC = join(
  SHADWEB_ROOT,
  "../../packages/react/forth-ui/src/components",
);
const REGISTRY_OUT = join(SHADWEB_ROOT, "registry/forth-ui");
const REGISTRY_JSON_PATH = join(SHADWEB_ROOT, "registry.json");

interface RegistryItemMeta {
  title: string;
  description: string;
}

interface NpmDeps {
  dependencies?: string[];
  devDependencies?: string[];
  /** Source folder, relative to forth-ui's `src/components`. @default name */
  source?: string;
}

/**
 * One entry per `packages/react/forth-ui/src/components/<name>` folder —
 * one registry item per folder (not per exported symbol), matching the
 * existing `exports: "./components/*"` / `index.ts`-per-folder convention.
 * `grid` is intentionally omitted (see file header).
 */
const COMPONENTS = JSON.parse(
  readFileSync(join(scriptDir, "forth-ui-registry/components.json"), "utf8"),
) as Record<string, RegistryItemMeta & NpmDeps>;

interface RegistryFileEntry {
  path: string;
  type: "registry:component";
  target: string;
}

interface RegistryItem {
  name: string;
  type: "registry:component";
  title: string;
  description: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFileEntry[];
}

function generateComponent(
  name: string,
  meta: RegistryItemMeta & NpmDeps,
): RegistryItem {
  const srcDir = join(FORTH_UI_SRC, meta.source ?? name);
  const outDir = join(REGISTRY_OUT, name);
  mkdirSync(outDir, { recursive: true });

  const shadcnDeps = new Set<string>();
  const forthUiDeps = new Set<string>();
  const files: RegistryFileEntry[] = [];

  for (const filename of readdirSync(srcDir).sort()) {
    if (!filename.endsWith(".ts") && !filename.endsWith(".tsx")) {
      continue;
    }
    const source = readFileSync(join(srcDir, filename), "utf8");
    const result = transformSource(source);
    for (const dep of result.shadcnDeps) shadcnDeps.add(dep);
    for (const dep of result.forthUiDeps) forthUiDeps.add(dep);

    writeFileSync(join(outDir, filename), result.content, "utf8");

    files.push({
      path: `registry/forth-ui/${name}/${filename}`,
      type: "registry:component",
      target: `@components/forth-ui/${name}/${filename}`,
    });
  }

  const registryDependencies = [
    ...[...shadcnDeps].sort(),
    ...[...forthUiDeps].sort().map((dep) => `@forth-ui/${dep}`),
  ];

  const item: RegistryItem = {
    name,
    type: "registry:component",
    title: meta.title,
    description: meta.description,
    files,
  };
  if (meta.dependencies !== undefined) item.dependencies = meta.dependencies;
  if (meta.devDependencies !== undefined)
    item.devDependencies = meta.devDependencies;
  if (registryDependencies.length > 0)
    item.registryDependencies = registryDependencies;

  return item;
}

function main() {
  rmSync(REGISTRY_OUT, { recursive: true, force: true });
  mkdirSync(REGISTRY_OUT, { recursive: true });

  const items = Object.entries(COMPONENTS)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, meta]) => generateComponent(name, meta));

  const registryJson = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "forth-ui",
    homepage: "https://github.com/Forthtilliath/forthtilliath-packages",
    items,
  };

  writeFileSync(
    REGISTRY_JSON_PATH,
    `${JSON.stringify(registryJson, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `Generated ${items.length.toString()} registry item(s) into ${REGISTRY_OUT}`,
  );
  console.log(`Wrote ${REGISTRY_JSON_PATH}`);
}

main();

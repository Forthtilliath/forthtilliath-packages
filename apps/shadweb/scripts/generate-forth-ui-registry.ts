/**
 * Generates `apps/shadweb/registry/forth-ui/**` (rewritten, registry-flavored
 * copies of `packages/react/forth-ui/src/components/**`) and the `items`
 * array of `apps/shadweb/registry.json`, ready for `shadcn build`.
 *
 * `packages/react/forth-ui/src/components/**` stays the single source of
 * truth — never hand-edit the generated `registry/forth-ui/**` output.
 *
 * Import-rewrite rules (only the string literal, never the imported names):
 *   @forthtilliath/shadcn-ui/components/X  -> @/components/ui/X   (+ bare registryDependency "X")
 *   @forthtilliath/shadcn-ui/lib/utils     -> @/lib/utils
 *   @forthtilliath/shadcn-ui/hooks/X       -> @/hooks/X
 *   ../other-forth-ui-component            -> @/components/forth-ui/other-forth-ui-component
 *                                              (+ namespaced registryDependency "@forth-ui/other-forth-ui-component")
 *   ./same-folder-sibling                  -> left untouched (lands in the same target subfolder)
 *   bare npm specifiers (qrcode, lucide-react, class-variance-authority, ...) -> left untouched,
 *     recorded into the item's own `dependencies`/`devDependencies` via COMPONENT_NPM_DEPS below.
 *
 * `grid` is deliberately excluded: it imports `@forthtilliath/react-hooks/useKeyListener`
 * (a real runtime hook) and `@forthtilliath/types/object` (a type-only utility) — both
 * private, unpublished monorepo packages. Registry-izing it needs those inlined as
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
}

/**
 * One entry per `packages/react/forth-ui/src/components/<name>` folder —
 * one registry item per folder (not per exported symbol), matching the
 * existing `exports: "./components/*"` / `index.ts`-per-folder convention.
 * `grid` is intentionally omitted (see file header).
 */
const COMPONENTS: Record<string, RegistryItemMeta & NpmDeps> = {
  accordion: {
    title: "Accordion",
    description:
      "A vertically stacked set of interactive headings that each reveal a section of content.",
    dependencies: ["class-variance-authority", "@radix-ui/react-accordion"],
  },
  alert: {
    title: "Alert",
    description: "Displays a callout for user attention.",
    dependencies: ["class-variance-authority"],
  },
  avatar: {
    title: "Avatar",
    description:
      "An image element with a fallback, plus badge/status indicators and grouping via AvatarGroup.",
    dependencies: ["class-variance-authority"],
  },
  badge: {
    title: "Badge",
    description: "Displays a badge or a component that looks like a badge.",
    dependencies: ["class-variance-authority", "lucide-react"],
  },
  banner: {
    title: "Banner",
    description: "A full-width, page-level announcement bar.",
    dependencies: ["class-variance-authority", "lucide-react"],
  },
  breadcrumb: {
    title: "Breadcrumb",
    description:
      "Displays the path to the current resource using a hierarchy of links.",
  },
  "bento-grid": {
    title: "BentoGrid",
    description:
      'A CSS-grid layout for unevenly-sized cards ("bento box" layouts).',
  },
  button: {
    title: "Button",
    description:
      "Displays a button or a component that looks like a button, plus ButtonGroup for joined rows/columns.",
    dependencies: ["class-variance-authority", "lucide-react"],
  },
  checkbox: {
    title: "CheckboxGroup",
    description: "A group of Checkboxes sharing a single array value.",
  },
  chip: {
    title: "Chip",
    description:
      "A compact, interactive element for displaying status, categories, or filters.",
  },
  "code-block": {
    title: "CodeBlock",
    description:
      "A syntax-highlighted code block with a copy-to-clipboard button.",
    dependencies: ["lucide-react", "shiki"],
  },
  collapsible: {
    title: "Collapsible",
    description:
      "An interactive component which expands/collapses a single panel.",
    dependencies: ["lucide-react"],
  },
  "color-picker": {
    title: "ColorPicker",
    description:
      "A color swatch + hex text input, kept in sync with the browser's native color picker.",
  },
  combobox: {
    title: "Combobox",
    description:
      "An autocomplete/searchable select, plus MultiSelect for multi-value selection.",
    dependencies: ["lucide-react"],
  },
  "command-palette": {
    title: "CommandPalette",
    description: "A global command menu (Cmd/Ctrl+K to open).",
  },
  "confirm-dialog": {
    title: "ConfirmDialog",
    description:
      "Provides useConfirm, an imperative `await confirm({...})` alternative to hand-wiring an AlertDialog.",
  },
  "count-animation": {
    title: "CountAnimation",
    description:
      "Animates a number counting up (or down) to a value whenever it changes.",
  },
  "date-picker": {
    title: "DatePicker",
    description: "A single-date picker built on a Popover + Calendar recipe.",
    dependencies: ["lucide-react"],
  },
  "description-list": {
    title: "DescriptionList",
    description: "A description list, with terms and descriptions.",
  },
  dropdrawer: {
    title: "Dropdrawer",
    description:
      "A menu that renders as a DropdownMenu on desktop and a bottom Drawer on mobile.",
  },
  dropzone: {
    title: "Dropzone",
    description:
      "A drag-and-drop file upload zone, listing accepted files below.",
    dependencies: ["lucide-react"],
  },
  field: {
    title: "Field",
    description:
      "Wires a label, description and error message to a single form control.",
  },
  "file-list": {
    title: "FileList",
    description:
      "Displays a list of files with details such as name, size, and upload progress.",
  },
  "image-input": {
    title: "ImageInput",
    description: "A click-to-upload image picker with a live preview.",
    dependencies: ["lucide-react"],
  },
  "infinite-scroll": {
    title: "InfiniteScroll",
    description:
      "Calls onLoadMore once a sentinel at the bottom of children scrolls into view.",
    dependencies: ["lucide-react"],
  },
  kbd: {
    title: "Kbd",
    description:
      "Displays which key or combination of keys performs a given action.",
  },
  link: {
    title: "Link",
    description:
      "A styled hyperlink, or a component that looks like one, plus LinkPreview for hover-triggered metadata cards.",
    dependencies: [
      "class-variance-authority",
      "lucide-react",
      "@radix-ui/react-slot",
    ],
  },
  marquee: {
    title: "Marquee",
    description: "Infinitely scrolls its children (a logo wall, a ticker).",
  },
  "multi-step-loader": {
    title: "MultiStepLoader",
    description:
      "A full-screen overlay stepping through a sequence of loading messages.",
    dependencies: ["lucide-react"],
  },
  navbar: {
    title: "Navbar",
    description:
      "A fixed, floating page header that visually shrinks on scroll, plus a mobile menu.",
    dependencies: ["lucide-react"],
  },
  "notification-center": {
    title: "NotificationCenter",
    description:
      "A bell-icon trigger with an unread-count badge, opening a popover list of notifications.",
    dependencies: ["lucide-react"],
  },
  "number-input": {
    title: "NumberInput",
    description: "A numeric input with increment/decrement stepper buttons.",
    dependencies: ["lucide-react"],
  },
  pagination: {
    title: "Pagination",
    description:
      "Navigates between pages of a paginated set, computing the visible page numbers and ellipses.",
    dependencies: ["lucide-react"],
  },
  "password-input": {
    title: "PasswordInput",
    description:
      "A password Input with a show/hide visibility toggle, plus a strength meter.",
    dependencies: ["lucide-react"],
  },
  progress: {
    title: "Progress",
    description:
      "Displays an indicator showing the completion progress of a task.",
    dependencies: ["class-variance-authority"],
  },
  "qr-code": {
    title: "QrCode",
    description: "Generates a QR code from a string, rendered as inline SVG.",
    dependencies: ["qrcode"],
    devDependencies: ["@types/qrcode"],
  },
  radio: {
    title: "RadioCard",
    description:
      "A card-style RadioGroup item — the whole card is the clickable target.",
    dependencies: ["lucide-react", "@radix-ui/react-radio-group"],
  },
  rating: {
    title: "Rating",
    description:
      "A star rating control with keyboard navigation and hover preview.",
    dependencies: ["lucide-react"],
  },
  "relative-time": {
    title: "RelativeTime",
    description: 'Displays a live-updating relative time ("2 minutes ago").',
  },
  reparent: {
    title: "Reparent",
    description:
      "Moves children between different container elements at different breakpoints.",
  },
  repeat: {
    title: "Repeat",
    description: "Repeats a component a specified number of times.",
  },
  "scroll-progress": {
    title: "ScrollProgress",
    description:
      "A fixed bar tracking scroll percentage of the page or a container.",
  },
  "scroll-shadow": {
    title: "ScrollShadow",
    description:
      "A vertically-scrollable container with fade-out gradient shadows at the edges.",
  },
  scrollspy: {
    title: "Scrollspy",
    description:
      "Tracks which of the given element ids is currently scrolled into view.",
  },
  separator: {
    title: "Separator",
    description: "Visually or semantically separates content.",
  },
  snippet: {
    title: "Snippet",
    description: "Displays and copies code in a tabbed interface.",
    dependencies: ["lucide-react"],
  },
  sortable: {
    title: "Sortable",
    description: "A drag-to-reorder list built on native HTML5 drag events.",
  },
  spacer: {
    title: "Spacer",
    description:
      "Adds space between components — a flexible filler or a fixed gap.",
  },
  spinner: {
    title: "Spinner",
    description:
      "An accessible loading indicator, in one of a few visual styles.",
    dependencies: ["class-variance-authority", "lucide-react"],
  },
  stepper: {
    title: "Stepper",
    description: "A numbered sequence of steps for a multi-stage flow.",
    dependencies: ["lucide-react"],
  },
  "submit-button": {
    title: "SubmitButton",
    description:
      "A submit Button that shows its own loading state automatically via useFormStatus.",
  },
  "tags-input": {
    title: "TagsInput",
    description: "A flexible input for adding/removing multiple tags.",
  },
  timeline: {
    title: "Timeline",
    description: "A vertical sequence of dated events, connected by a line.",
  },
  tree: {
    title: "Tree",
    description: "A hierarchical, expandable/collapsible list of nodes.",
    dependencies: ["lucide-react"],
  },
};

const SHADCN_IMPORT_RE =
  /from\s+(["'])@forthtilliath\/shadcn-ui\/components\/([a-z0-9-]+)\1/g;
const SHADCN_UTILS_IMPORT_RE =
  /from\s+(["'])@forthtilliath\/shadcn-ui\/lib\/utils\1/g;
const SHADCN_HOOKS_IMPORT_RE =
  /from\s+(["'])@forthtilliath\/shadcn-ui\/hooks\/([a-z0-9-]+)\1/g;
const SIBLING_IMPORT_RE = /from\s+(["'])\.\.\/([a-z0-9-]+)\1/g;

interface TransformResult {
  content: string;
  shadcnDeps: Set<string>;
  forthUiDeps: Set<string>;
}

function transformSource(source: string): TransformResult {
  const shadcnDeps = new Set<string>();
  const forthUiDeps = new Set<string>();

  let content = source.replace(
    SHADCN_IMPORT_RE,
    (_match, quote: string, name: string) => {
      shadcnDeps.add(name);
      return `from ${quote}@/components/ui/${name}${quote}`;
    },
  );
  content = content.replace(
    SHADCN_UTILS_IMPORT_RE,
    (_match, quote: string) => `from ${quote}@/lib/utils${quote}`,
  );
  content = content.replace(
    SHADCN_HOOKS_IMPORT_RE,
    (_match, quote: string, name: string) => {
      shadcnDeps.add(name);
      return `from ${quote}@/hooks/${name}${quote}`;
    },
  );
  content = content.replace(
    SIBLING_IMPORT_RE,
    (_match, quote: string, name: string) => {
      forthUiDeps.add(name);
      return `from ${quote}@/components/forth-ui/${name}${quote}`;
    },
  );

  return { content, shadcnDeps, forthUiDeps };
}

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
  const srcDir = join(FORTH_UI_SRC, name);
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
    homepage: "https://github.com/Forthtilliath/turborepo",
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

/**
 * Rewrites one forth-ui source file into its registry flavor — see the
 * import-rewrite rules in `../generate-forth-ui-registry.ts`'s header.
 */
const SHADCN_IMPORT_RE =
  /from\s+(["'])@forthtilliath\/shadcn-ui\/components\/([a-z0-9-]+)\1/g;
const SHADCN_UTILS_IMPORT_RE =
  /from\s+(["'])@forthtilliath\/shadcn-ui\/lib\/utils\1/g;
const SHADCN_HOOKS_IMPORT_RE =
  /from\s+(["'])@forthtilliath\/shadcn-ui\/hooks\/([a-z0-9-]+)\1/g;
const LOCALE_IMPORT_RE = /from\s+(["'])\.\.\/\.\.\/locale\/([a-zA-Z]+)\1/g;
const SIBLING_IMPORT_RE = /from\s+(["'])\.\.\/([a-z0-9-]+)\1/g;
// forth-ui is published as plain ESM, so its relative imports carry the
// NodeNext-style `.js` extension (`./variants.js`, `../button/index.js`).
// Registry consumers use shadcn's usual extensionless, bundler-resolved
// imports: strip them first, so the rules above see `./variants`/`../button`.
const RELATIVE_JS_EXTENSION_RE =
  /(from\s+["'])(\.{1,2}\/[^"']*?)(?:\/index)?\.js(["'])/g;

export interface TransformResult {
  content: string;
  shadcnDeps: Set<string>;
  forthUiDeps: Set<string>;
}

export function transformSource(source: string): TransformResult {
  const shadcnDeps = new Set<string>();
  const forthUiDeps = new Set<string>();

  let content = source.replace(RELATIVE_JS_EXTENSION_RE, "$1$2$3");
  content = content.replace(
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
    LOCALE_IMPORT_RE,
    (_match, quote: string, file: string) => {
      forthUiDeps.add("locale");
      return `from ${quote}@/components/forth-ui/locale/${file}${quote}`;
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

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import turboPlugin from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Node.js builtins without the `node:` prefix, as the first
 * `simple-import-sort/imports` group. Exported so other variants (e.g.
 * angular.js, which overrides this rule with Angular-specific groups) don't
 * have to duplicate the list to keep builtins sorted first too.
 * @type {string[]}
 */
export const NODE_BUILTIN_IMPORT_GROUP = [
  // Node.js builtins. You could also generate this regex if you use a `.js` config.
  // For example: `^(${require("module").builtinModules.join("|")})(/|$)`
  // Note that if you use the `node:` prefix for Node.js builtins,
  // you can avoid this complexity: You can simply use "^node:".
  "^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)",
];

/**
 * @typedef {object} BaseConfigOptions
 * @property {boolean} [prettier=true] - Append eslint-config-prettier at the
 *   end, turning off stylistic rules that would fight Prettier (which runs
 *   separately, not as an ESLint rule). Set to `false` if the consuming
 *   project doesn't use Prettier.
 * @property {boolean} [strict=true] - Use typescript-eslint's
 *   `strictTypeChecked` + `stylisticTypeChecked` presets. Set to `false` to
 *   fall back to the plain `recommended` preset instead (useful while
 *   migrating an existing codebase that isn't ready for the strict rules).
 * @property {boolean} [turbo=true] - Enable eslint-plugin-turbo's
 *   `no-undeclared-env-vars` rule. Only relevant inside a Turborepo; set to
 *   `false` for a standalone project.
 */

/**
 * Builds a shared ESLint configuration for the repository.
 *
 * @param {BaseConfigOptions} [options]
 * @returns {import("eslint").Linter.Config[]}
 */
export function createBaseConfig({
  prettier = true,
  strict = true,
  turbo = true,
} = {}) {
  return defineConfig([
    eslint.configs.recommended,
    strict ? tseslint.configs.strictTypeChecked : tseslint.configs.recommended,
    strict ? tseslint.configs.stylisticTypeChecked : [],
    {
      ignores: [
        "dist/**",
        "coverage/**",
        "storybook-static/**",
        "postcss.config.cjs",
        "postcss.config.mjs",
        "eslint.config.js",
        "eslint.config.mjs",
        "eslint.config.cjs",
        "eslint.config.ts",
      ],
    },
    {
      languageOptions: {
        // Globaux Node (process, __dirname, module, require...) : la config
        // partagée elle-même s'exécute sous Node (ex. process.cwd() ci-dessous),
        // et la plupart des consommateurs (scripts, configs, apps Next.js côté
        // serveur) en ont aussi besoin. Sans risque de collision avec les
        // globaux navigateur ajoutés par les configs plus spécifiques
        // (react.js, nextjs.js) qui étendent celle-ci.
        globals: {
          ...globals.node,
        },
        parserOptions: {
          projectService: true,
          tsconfigRootDir: process.cwd(),
        },
      },
    },
    {
      files: ["**/*.js"],
      extends: [tseslint.configs.disableTypeChecked],
    },
    {
      plugins: {
        "simple-import-sort": simpleImportSortPlugin,
      },
      rules: {
        "simple-import-sort/imports": [
          "error",
          {
            groups: [
              NODE_BUILTIN_IMPORT_GROUP,
              // Packages. `react` related packages come first.
              ["^react", "^@?\\w"],
              // Internal packages.
              ["^(@forthtilliath)(/.*|$)"],
              ["^(@|@ui|components|utils|config)(/.*|$)"],
              // Side effect imports.
              ["^\\u0000"],
              // Parent imports. Put `..` last.
              ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
              // Other relative imports. Put same-folder imports and `.` last.
              ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
              // Style imports.
              ["^.+\\.s?css$"],
            ],
          },
        ],
        "simple-import-sort/exports": "error",
      },
    },
    turbo
      ? {
          plugins: {
            turbo: turboPlugin,
          },
          rules: {
            "turbo/no-undeclared-env-vars": "error",
          },
        }
      : [],
    {
      files: ["**/*.{ts,tsx,mts,cts}"],
      plugins: {},
      rules: {
        // "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/ban-tslint-comment": "error",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/method-signature-style": "error",
        // ignoreStatic : sans ca, une reference a une methode statique (ex.
        // Validators.required dans un FormBuilder Angular) est a tort consideree
        // comme "unbound" alors qu'une methode statique n'a pas de `this` a lier.
        "@typescript-eslint/unbound-method": ["error", { ignoreStatic: true }],
        // allowNumber : tres courant de construire une URL avec un id numerique
        // (`${this.baseUrl}/${id}`) ; sans ca, chaque service HTTP typique
        // declenche une erreur pour un usage parfaitement sur.
        "@typescript-eslint/restrict-template-expressions": [
          "error",
          { allowNumber: true },
        ],
        "@typescript-eslint/naming-convention": [
          "error",
          // https://typescript-eslint.io/rules/naming-convention
          {
            selector: "variable",
            format: ["camelCase"],
            leadingUnderscore: "allow",
          },
          {
            selector: "variable",
            modifiers: ["const"],
            format: ["camelCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
          },
          {
            selector: "function",
            format: ["camelCase"],
          },
          {
            selector: "typeLike",
            format: ["PascalCase"],
          },
        ],
      },
    },
    prettier ? eslintConfigPrettier : [],
  ]);
}

/**
 * A shared ESLint configuration for the repository, with the default options.
 * Use `createBaseConfig(options)` instead to customize it.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const baseConfig = createBaseConfig();

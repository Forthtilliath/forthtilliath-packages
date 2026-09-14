import angular from "angular-eslint";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

import { createBaseConfig, NODE_BUILTIN_IMPORT_GROUP } from "./base.js";

/**
 * A custom ESLint configuration for Angular applications/libraries.
 *
 * Assumes the standard Angular CLI selector prefix ("app") set by `ng new`;
 * for a project generated with a different `--prefix`, override
 * `@angular-eslint/directive-selector` / `@angular-eslint/component-selector`
 * locally after spreading this config.
 *
 * @param {import("./base.js").BaseConfigOptions} [options]
 * @returns {import("eslint").Linter.Config[]}
 */
export function createAngularConfig(options) {
  return defineConfig([
    ...createBaseConfig(options),
    {
      // Build/cache artifacts specific to the Angular CLI (baseConfig only knows
      // about generic dist/**) : without this, ESLint also lints the bundled,
      // minified Vite dep cache and reports thousands of spurious errors on it.
      ignores: [".angular/**", "dist/**", "coverage/**"],
    },
    {
      files: ["**/*.ts"],
      extends: [angular.configs.tsRecommended],
      processor: angular.processInlineTemplates,
      rules: {
        "@angular-eslint/directive-selector": [
          "error",
          { type: "attribute", prefix: "app", style: "camelCase" },
        ],
        "@angular-eslint/component-selector": [
          "error",
          { type: "element", prefix: "app", style: "kebab-case" },
        ],
        // Un composant/page Angular sans logique propre (juste un template +
        // decorateur) est un corps de classe legitimement vide, pas du code mort.
        "@typescript-eslint/no-extraneous-class": "off",
        // Convention Angular : le framework (et RxJS, quasi-systematiquement
        // utilise a ses cotes) se lit avant le reste — packages tiers, puis
        // imports internes de l'app. baseConfig's generic "^@?\\w" group
        // sorts every third-party package alphabetically together, which
        // would interleave "@angular/core" with unrelated libs instead.
        "simple-import-sort/imports": [
          "error",
          {
            groups: [
              NODE_BUILTIN_IMPORT_GROUP,
              ["^@angular", "^rxjs"],
              ["^@?\\w"],
              ["^(@forthtilliath)(/.*|$)"],
              ["^(@|@ui|components|utils|config)(/.*|$)"],
              ["^\\u0000"],
              ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
              ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ],
          },
        ],
      },
    },
    {
      // baseConfig's tseslint.configs.strictTypeChecked/stylisticTypeChecked apply
      // with no `files` restriction, so without this they leak onto templates
      // (parsed by angular-eslint/template-parser, which has no type information)
      // and crash on the first type-aware rule ESLint tries to load.
      files: ["**/*.html"],
      extends: [
        tseslint.configs.disableTypeChecked,
        angular.configs.templateRecommended,
        angular.configs.templateAccessibility,
      ],
      rules: {},
    },
  ]);
}

/**
 * A custom ESLint configuration for Angular applications/libraries, with the
 * default options. Use `createAngularConfig(options)` instead to customize it.
 *
 * @type {import("eslint").Linter.Config[]} */
export const angularConfig = createAngularConfig();

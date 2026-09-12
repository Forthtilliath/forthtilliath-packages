import pluginNext from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";

import { createReactConfig } from "./react.js";

/**
 * A custom ESLint configuration for Next.js applications, built on top of
 * {@link createReactConfig} (same React/naming-convention rules, plus
 * Next.js's own plugin).
 *
 * @param {import("./base.js").BaseConfigOptions & import("./react.js").ReactConfigOptions} [options]
 * @returns {import("eslint").Linter.Config[]}
 * */
export function createNextJsConfig(options) {
  return defineConfig([
    {
      ignores: [".next/**", "next-env.d.ts"],
    },
    ...createReactConfig(options),
    {
      plugins: {
        "@next/next": pluginNext,
      },
      rules: {
        ...pluginNext.configs.recommended.rules,
        ...pluginNext.configs["core-web-vitals"].rules,
      },
    },
    {
      rules: {
        "react-refresh/only-export-components": [
          "error",
          {
            // App Router convention: page.tsx/layout.tsx/template.tsx
            // legitimately co-export a default component alongside these
            // route-config bindings — not a Fast Refresh hazard, just how
            // the framework wires routes.
            allowExportNames: [
              "metadata",
              "generateMetadata",
              "viewport",
              "generateViewport",
              "generateStaticParams",
              "dynamic",
              "dynamicParams",
              "revalidate",
              "fetchCache",
              "runtime",
              "preferredRegion",
              "maxDuration",
              // icon.tsx / apple-icon.tsx / opengraph-image.tsx /
              // twitter-image.tsx: same convention, for the image-generation
              // route handlers.
              "alt",
              "size",
              "contentType",
            ],
          },
        ],
      },
    },
  ]);
}

/**
 * A custom ESLint configuration for Next.js applications, with the default
 * options. Use `createNextJsConfig(options)` instead to customize it.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = createNextJsConfig();

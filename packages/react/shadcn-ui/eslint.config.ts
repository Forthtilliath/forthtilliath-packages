import type { Linter } from "eslint";

import { reactConfig } from "@forthtilliath/eslint-config/react";

const config: Linter.Config[] = [
  ...reactConfig,
  {
    // shadcn/ui components intentionally co-locate a `xxxVariants` cva()
    // export next to the component (e.g. buttonVariants, badgeVariants) so
    // consumers can reuse the same class variants on custom elements. That
    // breaks Fast Refresh's "one component per file" assumption, but it's
    // the upstream shadcn CLI convention, not a bug in this code.
    files: ["src/components/**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
      // These components map over static, caller-provided arrays (accordion
      // items, navbar links, carousel dots, date-picker presets) that are
      // never filtered/reordered/inserted into at runtime, so an index key
      // is safe and there's no natural stable id to use instead.
      "@eslint-react/no-array-index-key": "off",
    },
  },
];

export default config;

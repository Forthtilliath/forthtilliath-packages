import type { Linter } from "eslint";

import { storybookConfig } from "@forthtilliath/eslint-config/storybook";

const config: Linter.Config[] = [
  { ignores: ["scripts/**"] },
  ...storybookConfig,
  {
    // Renders a purely count-based placeholder list
    // (`Array.from({ length: N })`, numbered 1..N) with no other identity
    // and never reordered/filtered, so an index key is safe.
    files: ["src/stories/shadcn-ui/carousel.stories.tsx"],
    rules: {
      "@eslint-react/no-array-index-key": "off",
    },
  },
  {
    // Stories demo components with simplified/placeholder markup (`href="#"`
    // action links, illustrative alt text, label examples with no real
    // control) — not real, navigable UI, so the strict a11y checks that
    // assume production content don't apply here. The components themselves
    // (forth-ui, shadcn-ui) are linted for real under their own package.
    files: ["**/*.stories.tsx"],
    rules: {
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/img-redundant-alt": "off",
      "jsx-a11y/label-has-associated-control": "off",
    },
  },
];

export default config;

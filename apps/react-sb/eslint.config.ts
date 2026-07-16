import { storybookConfig } from "@forthtilliath/eslint-config/storybook";

export default [
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
];

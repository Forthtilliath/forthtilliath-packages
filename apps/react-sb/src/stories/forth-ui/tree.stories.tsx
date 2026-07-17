import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tree } from "@forthtilliath/forth-ui/components/tree";

/**
 * A hierarchical, expandable/collapsible list of nodes.
 */
const meta = {
  title: "forth-ui/Tree",
  component: Tree,
  args: {
    data: [
      {
        label: "src",
        children: [
          {
            label: "components",
            children: [{ label: "button.tsx" }, { label: "input.tsx" }],
          },
          { label: "index.ts" },
        ],
      },
      { label: "package.json" },
      { label: "README.md" },
    ],
    className: "w-72",
  },
} satisfies Meta<typeof Tree>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Click a folder to expand/collapse it.
 */
export const Default: Story = {};

/**
 * `defaultExpanded` opens every branch initially.
 */
export const DefaultExpanded: Story = {
  args: {
    defaultExpanded: true,
  },
};

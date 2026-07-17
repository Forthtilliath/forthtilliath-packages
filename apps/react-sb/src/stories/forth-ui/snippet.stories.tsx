import type { Meta, StoryObj } from "@storybook/react-vite";

import { Snippet } from "@forthtilliath/forth-ui/components/snippet";

/**
 * Displays and copies code in a tabbed interface — the "npm install /
 * yarn add / pnpm add" pattern.
 */
const meta = {
  title: "forth-ui/Snippet",
  component: Snippet,
  args: {
    className: "w-96",
    items: [
      {
        value: "npm",
        label: "npm",
        code: "npm install @forthtilliath/forth-ui",
      },
      {
        value: "yarn",
        label: "yarn",
        code: "yarn add @forthtilliath/forth-ui",
      },
      {
        value: "pnpm",
        label: "pnpm",
        code: "pnpm add @forthtilliath/forth-ui",
      },
      { value: "bun", label: "bun", code: "bun add @forthtilliath/forth-ui" },
    ],
  },
} satisfies Meta<typeof Snippet>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form — click a tab, then the copy icon.
 */
export const Default: Story = {};

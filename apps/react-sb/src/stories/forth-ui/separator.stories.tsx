import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "@forthtilliath/forth-ui/components/separator";

/**
 * Visually or semantically separates content.
 */
const meta = {
  title: "forth-ui/Layout/Separator",
  component: Separator,
  args: {
    className: "w-64",
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default, plain horizontal line.
 */
export const Default: Story = {};

/**
 * Use the `label` prop for a centered "OR"-style divider.
 */
export const WithLabel: Story = {
  args: {
    label: "OR",
  },
};

/**
 * `orientation="vertical"` for a toolbar-style divider between inline
 * items.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
    className: "h-6",
  },
  render: (args) => (
    <div className="flex items-center gap-3 text-sm">
      <span>Item 1</span>
      <Separator {...args} />
      <span>Item 2</span>
      <Separator {...args} />
      <span>Item 3</span>
    </div>
  ),
};

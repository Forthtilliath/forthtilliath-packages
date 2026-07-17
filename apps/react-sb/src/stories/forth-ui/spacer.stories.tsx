import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spacer } from "@forthtilliath/forth-ui/components/spacer";
import { Button } from "@forthtilliath/shadcn-ui/components/button";

/**
 * Adds space between components — a flexible filler by default, or a
 * fixed gap via `size`.
 */
const meta = {
  title: "forth-ui/Layout/Spacer",
  component: Spacer,
} satisfies Meta<typeof Spacer>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Without `size`, the spacer grows to fill the remaining space — pushing
 * the second button to the far right.
 */
export const Flexible: Story = {
  render: () => (
    <div className="border-border flex w-96 items-center border p-2">
      <Button variant="outline" size="sm">
        Left
      </Button>
      <Spacer />
      <Button variant="outline" size="sm">
        Right
      </Button>
    </div>
  ),
};

/**
 * With `size`, the spacer is a fixed gap instead.
 */
export const FixedSize: Story = {
  render: () => (
    <div className="border-border flex w-fit items-center border p-2">
      <Button variant="outline" size="sm">
        Left
      </Button>
      <Spacer size={8} />
      <Button variant="outline" size="sm">
        Right
      </Button>
    </div>
  ),
};

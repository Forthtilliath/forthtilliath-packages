import type { Meta, StoryObj } from "@storybook/react-vite";

import { GradientFrame } from "@forthtilliath/forth-ui/components/gradient-frame";

const PLACEHOLDER = (
  <div className="bg-muted text-muted-foreground grid aspect-video w-80 place-items-center text-sm">
    Photo
  </div>
);

/**
 * A visual laid on an offset, gradient-filled frame.
 */
const meta = {
  title: "forth-ui/Data Display/GradientFrame",
  component: GradientFrame,
  args: {
    children: PLACEHOLDER,
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GradientFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Tinted with `primary`, sticking out on the right.
 */
export const Default: Story = {};

/**
 * Sticking out on the left.
 */
export const Left: Story = {
  args: {
    side: "left",
  },
};

/**
 * Custom gradient stops through `className.frame`.
 */
export const CustomGradient: Story = {
  args: {
    className: { frame: "from-lime-500 via-teal-500 to-sky-400" },
  },
};

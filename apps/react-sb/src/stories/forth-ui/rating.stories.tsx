import type { Meta, StoryObj } from "@storybook/react-vite";

import { Rating } from "@forthtilliath/forth-ui/components/rating";

/**
 * A star rating control with keyboard navigation and hover preview.
 */
const meta = {
  title: "forth-ui/Forms/Rating",
  component: Rating,
  args: {
    defaultValue: 3,
  },
} satisfies Meta<typeof Rating>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Click a star to rate, hover to preview.
 */
export const Default: Story = {};

/**
 * `max` controls the number of stars.
 */
export const TenStars: Story = {
  args: {
    max: 10,
    defaultValue: 7,
  },
};

/**
 * `readOnly` displays a fixed rating without interaction.
 */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 4,
  },
};

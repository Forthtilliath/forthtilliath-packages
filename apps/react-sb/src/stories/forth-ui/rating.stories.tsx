import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

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

export const ShouldRateWithMouseAndKeyboard: Story = {
  name: "when clicking a star or pressing arrows, should update the rating",
  tags: ["!dev", "!autodocs"],
  args: { onValueChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const fiveStars = canvas.getByRole("radio", { name: "5 stars" });
    await userEvent.click(fiveStars);
    await expect(fiveStars).toBeChecked();

    await userEvent.keyboard("{ArrowLeft}");
    const fourStars = canvas.getByRole("radio", { name: "4 stars" });
    await expect(fourStars).toBeChecked();
    await expect(fourStars).toHaveFocus();

    await userEvent.keyboard("{Home}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(1);
  },
};

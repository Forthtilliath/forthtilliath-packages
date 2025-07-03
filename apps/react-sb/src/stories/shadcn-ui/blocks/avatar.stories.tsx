import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "@forthtilliath/shadcn-ui/components/blocks/avatar";

/**
 * An image element with a fallback for representing the user.
 */
const meta = {
  title: "shadcn-ui-blocks/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    src: "https://github.com/shadcn.png",
    alt: "@shadcn",
    fallback: "CN",
    size: 24,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the avatar.
 */
export const Default: Story = {};

export const Fallback: Story = {
  args: {
    src: "https://error-link.html",
  },
};

export const Rounded: Story = {
  args: {
    rounded: "lg",
  },
};

export const Size: Story = {
  args: {
    size: 16,
  },
};

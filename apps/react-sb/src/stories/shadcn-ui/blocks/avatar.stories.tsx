import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "@forthtilliath/shadcn-ui/components/blocks/avatar";

/**
 * An image element with a fallback for representing the user.
 */
const meta = {
  title: "shadcn-ui-blocks/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    ring: {
      description: "Add a ring around the avatar.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    rounded: {
      description: "Use the `rounded` prop to change the shape of the avatar.",
      options: ["full", "lg", "md", "none"],
      control: { type: "select" },
      table: {
        type: { summary: "full | lg | md | none" },
        defaultValue: { summary: "full" },
      },
    },
    size: {
      description: "Use the `size` prop to change the size of the avatar.",
      options: [8, 10, 12, 14, 16, 20, 24],
      control: { type: "select" },
      table: {
        type: { summary: "8 | 10 | 12 | 14 | 16 | 20 | 24" },
      },
    },
  },
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

/**
 * Use `rounded="md"` for a moderately rounded avatar.
 */
export const RoundedMd: Story = {
  args: {
    rounded: "md",
  },
};

/**
 * Use `rounded="none"` for a square avatar with no rounding.
 */
export const RoundedNone: Story = {
  args: {
    rounded: "none",
  },
};

export const Size: Story = {
  args: {
    size: 16,
  },
};

/**
 * The remaining sizes on the `size` scale: 8, 10, 12, 14 and 20.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <Avatar {...args} size={8} />
      <Avatar {...args} size={10} />
      <Avatar {...args} size={12} />
      <Avatar {...args} size={14} />
      <Avatar {...args} size={20} />
    </div>
  ),
};

/**
 * Use the `ring` prop to add a ring around the avatar.
 */
export const Ring: Story = {
  args: {
    ring: true,
  },
};

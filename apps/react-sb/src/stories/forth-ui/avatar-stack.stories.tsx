import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "@forthtilliath/forth-ui/components/avatar";

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 */
const meta = {
  title: "forth-ui/AvatarStack",
  component: Avatar,
  argTypes: {
    src: {
      description: "The source URL of the image.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Required" },
      },
    },
    alt: {
      description: "The alt text for the image.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Required" },
      },
    },
    status: {
      description: "The status of the user.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Required" },
      },
    },
  },
  args: {
    src: "https://github.com/shadcn.png",
    alt: "@shadcn",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default avatar with default styles.
 */
export const Default: Story = {};

/**
 * Use the `outline` variant to create an outline styled accordion.
 * This variant displays a minimal outline style for the accordion items.
 */
export const Outline: Story = {
  args: {
  },
};

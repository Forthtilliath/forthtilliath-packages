import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@forthtilliath/shadcn-ui/components/badge";
import { BadgeCheckIcon } from "lucide-react";

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta = {
  title: "shadcn-ui/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
    },
  },
  args: {
    children: "Badge",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the badge.
 */
export const Default: Story = {};

/**
 * Use the `secondary` badge to call for less urgent information, blending
 * into the interface while still signaling minor updates or statuses.
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

/**
 * Use the `destructive` badge to  indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

/**
 * Use the `outline` badge for overlaying without obscuring interface details,
 * emphasizing clarity and subtlety..
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};
export const WithIcon: Story = {
  args: {
    variant: "secondary",
    className: "bg-blue-500 text-white dark:bg-blue-600",
    children: (
      <>
        <BadgeCheckIcon />
        Verified
      </>
    ),
  },
};

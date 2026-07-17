import type { Meta, StoryObj } from "@storybook/react-vite";

import { NotificationCenter } from "@forthtilliath/forth-ui/components/notification-center";

/**
 * A bell-icon trigger with an unread-count badge, opening a popover list
 * of notifications.
 */
const meta = {
  title: "forth-ui/NotificationCenter",
  component: NotificationCenter,
  args: {
    notifications: [
      {
        id: "1",
        title: "New comment on your post",
        description: "Alice replied to your comment.",
        date: "2m ago",
        read: false,
      },
      {
        id: "2",
        title: "Deploy succeeded",
        description: "dev-tw-sb deployed to production.",
        date: "1h ago",
        read: false,
      },
      {
        id: "3",
        title: "Weekly digest",
        description: "Your weekly summary is ready.",
        date: "1d ago",
        read: true,
      },
    ],
  },
} satisfies Meta<typeof NotificationCenter>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Click the bell to open the list.
 */
export const Default: Story = {};

/**
 * No notifications — shows the empty state.
 */
export const Empty: Story = {
  args: {
    notifications: [],
  },
};

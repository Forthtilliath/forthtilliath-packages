import type { Meta, StoryObj } from "@storybook/react-vite";
import { GitCommitIcon, PackageIcon, RocketIcon } from "lucide-react";

import { Timeline } from "@forthtilliath/forth-ui/components/timeline";

/**
 * A vertical sequence of dated events, connected by a line.
 */
const meta = {
  title: "forth-ui/Timeline",
  component: Timeline,
  args: {
    items: [
      {
        date: "2026-07-01",
        title: "Project kickoff",
        description: "Initial planning and scoping.",
        icon: <GitCommitIcon />,
      },
      {
        date: "2026-07-10",
        title: "Beta release",
        description: "Shipped to early testers.",
        icon: <PackageIcon />,
      },
      {
        date: "2026-07-17",
        title: "v1.0 launch",
        description: "Public release.",
        icon: <RocketIcon />,
      },
    ],
    className: "w-96",
  },
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form.
 */
export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollProgress } from "@forthtilliath/forth-ui/components/scroll-progress";

/**
 * A fixed bar at the top of the page that fills as the user scrolls.
 */
const meta = {
  title: "forth-ui/ScrollProgress",
  component: ScrollProgress,
} satisfies Meta<typeof ScrollProgress>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Scroll the canvas to see the bar fill.
 */
export const Default: Story = {
  render: () => (
    <div className="relative h-[150vh]">
      <ScrollProgress />
      <p className="text-muted-foreground pt-24 text-center text-sm">
        Scroll down — the bar at the very top fills as you go.
      </p>
    </div>
  ),
};

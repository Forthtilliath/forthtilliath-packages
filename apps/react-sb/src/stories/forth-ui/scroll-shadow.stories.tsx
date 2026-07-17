import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollShadow } from "@forthtilliath/forth-ui/components/scroll-shadow";

/**
 * A vertically-scrollable container with fade-out gradient shadows at the
 * top/bottom edges, hidden once scrolled all the way to that edge.
 */
const meta = {
  title: "forth-ui/Layout/ScrollShadow",
  component: ScrollShadow,
  args: {
    className: "h-64 w-72 rounded-lg border",
    children: (
      <div className="grid gap-3 p-4">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={`line-${(i + 1).toString()}`} className="text-sm">
            Line {i + 1} of scrollable content.
          </p>
        ))}
      </div>
    ),
  },
} satisfies Meta<typeof ScrollShadow>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Scroll inside the box — the top fade appears once you scroll down, and
 * the bottom fade disappears once you reach the end.
 */
export const Default: Story = {};

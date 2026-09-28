import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDays, MapPin } from "lucide-react";

import { IconBubble } from "@forthtilliath/forth-ui/components/icon-bubble";

/**
 * An icon inside a round, tinted bubble.
 */
const meta = {
  title: "forth-ui/Data Display/IconBubble",
  component: IconBubble,
  args: {
    icon: CalendarDays,
  },
} satisfies Meta<typeof IconBubble>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Tinted with `primary`.
 */
export const Default: Story = {};

/**
 * The three sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconBubble icon={MapPin} size="sm" />
      <IconBubble icon={MapPin} />
      <IconBubble icon={MapPin} size="lg" />
    </div>
  ),
};

/**
 * Leading an information line, with a custom tint.
 */
export const InfoLine: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <IconBubble icon={MapPin} className="bg-teal-500/15 text-teal-600" />
      <span>12 rue des Lilas, Angers</span>
    </div>
  ),
};

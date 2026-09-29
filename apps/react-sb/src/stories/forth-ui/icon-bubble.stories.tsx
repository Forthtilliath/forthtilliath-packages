import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarDays, Clock, Mail, MapPin, Music } from "lucide-react";

import { IconBubble } from "@forthtilliath/forth-ui/components/icon-bubble";

import { nameComponentProps } from "../../../.storybook/source";

const ICONS = { CalendarDays, Clock, Mail, MapPin, Music };
type IconName = keyof typeof ICONS;

/** The icon's import name, for "Show code" (args hold the component itself). */
function iconName(icon: unknown): string {
  return (
    Object.entries(ICONS).find(
      ([name, component]) => component === icon || name === icon,
    )?.[0] ?? "Icon"
  );
}

/**
 * An icon inside a round, tinted bubble.
 */
const meta = {
  title: "forth-ui/Data Display/IconBubble",
  component: IconBubble,
  argTypes: {
    icon: {
      description: "The lucide-react (or any) icon component to render.",
      options: Object.keys(ICONS) as IconName[],
      mapping: ICONS,
      control: { type: "select" },
    },
  },
  args: {
    // An option name: argTypes.icon.mapping turns it into the component.
    icon: "CalendarDays" as unknown as typeof CalendarDays,
  },
  parameters: {
    docs: {
      source: {
        transform: (code: string, { args }: { args: { icon?: unknown } }) =>
          nameComponentProps(code, iconName(args.icon)),
      },
    },
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
  args: { icon: "MapPin" as unknown as typeof MapPin },
  render: ({ icon }) => (
    <div className="flex items-center gap-3">
      <IconBubble icon={icon} size="sm" />
      <IconBubble icon={icon} />
      <IconBubble icon={icon} size="lg" />
    </div>
  ),
};

/**
 * Leading an information line, with a custom tint.
 */
export const InfoLine: Story = {
  args: { icon: "MapPin" as unknown as typeof MapPin },
  render: ({ icon }) => (
    <div className="flex items-center gap-3 text-sm">
      <IconBubble icon={icon} className="bg-teal-500/15 text-teal-600" />
      <span>12 rue des Lilas, Angers</span>
    </div>
  ),
};

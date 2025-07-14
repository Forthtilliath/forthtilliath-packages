import type { Meta, StoryObj } from "@storybook/react-vite";
import { InboxIcon } from "lucide-react";

import { Navbar } from "@forthtilliath/shadcn-ui/components/blocks/navbar-02";

/**
 * A simple navbar block
 */
const meta: Meta<typeof Navbar> = {
  title: "shadcn-ui-blocks/Navbars/Navbar 02",
  component: Navbar,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    items: [
      { href: "#", label: "Home" },
      { href: "#", label: "About" },
      { href: "#", label: "Contact" },
    ],
    render: ({ href, label }) => <a href={href}>{label}</a>,
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-muted">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Without logo
 */
export const Default: Story = {};

/**
 * With logo
 */
export const Logo: Story = {
  args: {
    logo: <InboxIcon size={32} />,
  },
};

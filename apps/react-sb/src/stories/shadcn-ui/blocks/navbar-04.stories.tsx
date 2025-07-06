import type { Meta, StoryObj } from "@storybook/react-vite";
import { Layers3 } from "lucide-react";

import { Navbar } from "@forthtilliath/shadcn-ui/components/blocks/navbar-04";

/**
 * A simple navbar block
 */
const meta: Meta<typeof Navbar> = {
  title: "shadcn-ui-blocks/Navbars/Navbar 04",
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
    logo: <Layers3 size={32} />,
  },
};

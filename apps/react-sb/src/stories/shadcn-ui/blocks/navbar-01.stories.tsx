import type { Meta, StoryObj } from "@storybook/react-vite";
import { LampCeiling } from "lucide-react";

import { Navbar01 } from "@forthtilliath/shadcn-ui/components/blocks/navbar-01";

/**
 * A simple navbar block
 */
const meta: Meta<typeof Navbar01> = {
  title: "shadcn-ui-derived/Navbars/01",
  component: Navbar01,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    items: [
      { id: 0, href: "#", label: "Home" },
      { id: 1, href: "#", label: "About" },
      { id: 2, href: "#", label: "Contact" },
    ],
    render: ({ href, children }) => <a href={href}>{children}</a>,
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
    logo: <LampCeiling size={32} />,
  },
};

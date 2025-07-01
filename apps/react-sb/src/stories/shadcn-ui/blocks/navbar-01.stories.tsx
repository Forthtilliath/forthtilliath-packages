import type { Meta, StoryObj } from "@storybook/react-vite";
import { LampCeiling } from "lucide-react";

import { Navbar } from "@forthtilliath/shadcn-ui/components/blocks/navbar-01";

/**
 * A simple navbar block
 */
const meta: Meta<typeof Navbar> = {
  title: "shadcn-ui-derived/Navbars/01",
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

import type { Meta, StoryObj } from "@storybook/react-vite";
import { HouseIcon } from "lucide-react";

import { Breadcrumb } from "@forthtilliath/forth-ui/components/breadcrumb";

/**
 * Displays the path to the current resource using a hierarchy of links.
 */
const meta = {
  title: "forth-ui/Breadcrumb",
  component: Breadcrumb,
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Components", href: "/components" },
      { label: "Breadcrumb" },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form — first items are links, the last is the current page.
 */
export const Default: Story = {};

/**
 * The first item can carry an icon (e.g. a house for "Home").
 */
export const WithIcon: Story = {
  args: {
    items: [
      { label: "Home", href: "/", icon: <HouseIcon className="size-4" /> },
      { label: "Components", href: "/components" },
      { label: "Breadcrumb" },
    ],
  },
};

/**
 * When there are more items than `maxItems`, the middle ones collapse into
 * a dropdown "…" — unlike shadcn-ui's own `BreadcrumbEllipsis`, this is a
 * real clickable dropdown menu exposing the hidden items.
 */
export const Collapsed: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Categories", href: "/products/categories" },
      { label: "Electronics", href: "/products/categories/electronics" },
      { label: "Laptops" },
    ],
  },
};

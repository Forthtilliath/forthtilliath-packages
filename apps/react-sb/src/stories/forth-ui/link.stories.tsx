import type { Meta, StoryObj } from "@storybook/react-vite";

import { Link } from "@forthtilliath/forth-ui/components/link";

/**
 * A styled hyperlink, or a component that looks like one.
 */
const meta = {
  title: "forth-ui/Link",
  component: Link,
  args: {
    href: "#",
    children: "Link",
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form — underlines on hover.
 */
export const Default: Story = {};

/**
 * Each `variant` × `underline` combination.
 */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["default", "primary", "muted", "destructive"] as const).map(
        (variant) => (
          <div key={variant} className="flex items-center gap-4">
            <Link href="#" variant={variant} underline="none">
              {variant} / none
            </Link>
            <Link href="#" variant={variant} underline="hover">
              {variant} / hover
            </Link>
            <Link href="#" variant={variant} underline="always">
              {variant} / always
            </Link>
          </div>
        ),
      )}
    </div>
  ),
};

/**
 * An absolute `http(s)` `href` is auto-detected as external — it opens in a
 * new tab and gets a trailing arrow icon. Override with `isExternal`.
 */
export const External: Story = {
  args: {
    href: "https://example.com",
    children: "External link",
  },
};

/**
 * `disabled` removes pointer interaction and dims the link.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

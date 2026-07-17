import type { Meta, StoryObj } from "@storybook/react-vite";
import { MegaphoneIcon } from "lucide-react";

import { Banner } from "@forthtilliath/forth-ui/components/banner";

/**
 * A full-width, page-level announcement bar — as opposed to `Alert`, which
 * is an inline callout within page content.
 */
const meta = {
  title: "forth-ui/Banner",
  component: Banner,
  argTypes: {
    variant: {
      options: [
        "default",
        "primary",
        "success",
        "warning",
        "info",
        "destructive",
      ],
      control: { type: "select" },
    },
    look: {
      options: ["solid", "soft", "outline"],
      control: { type: "radio" },
    },
  },
  args: {
    variant: "primary",
    look: "solid",
  },
  render: (args) => (
    <Banner {...args}>
      <MegaphoneIcon />
      <span>A new version is available. Refresh to update.</span>
    </Banner>
  ),
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the banner, full-width.
 */
export const Default: Story = {};

/**
 * Use the `inset` prop for a contained variant with rounded corners,
 * instead of the default edge-to-edge bar.
 */
export const Inset: Story = {
  args: {
    inset: true,
    look: "soft",
  },
};

/**
 * Use the `dismissible` prop to show a close button. Uncontrolled by
 * default — the banner hides itself once dismissed.
 */
export const Dismissible: Story = {
  args: {
    variant: "warning",
    look: "soft",
    dismissible: true,
  },
  render: (args) => (
    <Banner {...args}>
      <span>Your trial ends in 3 days.</span>
    </Banner>
  ),
};

/**
 * Use the `action` prop to render a link or button alongside the message.
 */
export const WithAction: Story = {
  args: {
    dismissible: true,
    action: (
      <a href="#" className="font-medium underline underline-offset-2">
        Learn more
      </a>
    ),
  },
};

/**
 * Use `sticky` to pin the banner to the top of the viewport, and
 * `hideOnScroll` to auto-hide it once the page scrolls past ~40px — try
 * scrolling the canvas in this story.
 */
export const StickyHideOnScroll: Story = {
  args: {
    sticky: true,
    hideOnScroll: true,
  },
  render: (args) => (
    <div>
      <Banner {...args}>
        <MegaphoneIcon />
        <span>Scroll down — this banner hides itself.</span>
      </Banner>
      <div className="text-muted-foreground space-y-4 p-8 text-sm">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
          <p key={n}>Scroll content line {n}</p>
        ))}
      </div>
    </div>
  ),
};

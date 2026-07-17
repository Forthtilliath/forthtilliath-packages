import type { Meta, StoryObj } from "@storybook/react-vite";
import { BadgeCheckIcon } from "lucide-react";

import {
  Badge,
  type BadgeVariants,
} from "@forthtilliath/forth-ui/components/badge";
import { Grid } from "@forthtilliath/forth-ui/components/grid";

const VARIANTS: NonNullable<BadgeVariants["variant"]>[] = [
  "default",
  "secondary",
  "primary",
  "success",
  "warning",
  "info",
  "destructive",
];
const LOOKS: NonNullable<BadgeVariants["look"]>[] = [
  "solid",
  "soft",
  "outline",
];

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta = {
  title: "forth-ui/Feedback/Badge",
  component: Badge,
  argTypes: {
    variant: {
      options: VARIANTS,
      control: { type: "select" },
    },
    look: {
      options: LOOKS,
      control: { type: "radio" },
    },
    shape: {
      options: ["rounded", "pill", "square"],
      control: { type: "radio" },
    },
    size: {
      options: ["sm", "default", "lg"],
      control: { type: "radio" },
    },
  },
  args: {
    children: "Badge",
    variant: "default",
    look: "solid",
    shape: "rounded",
    size: "default",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the badge.
 */
export const Default: Story = {};

/**
 * Use the `variant` prop for semantic meaning and `look` to control how
 * strongly it stands out (solid, soft, outline).
 */
export const Colors: Story = {
  render: () => (
    <Grid cols={3}>
      {VARIANTS.flatMap((variant) =>
        LOOKS.map((look) => (
          <Badge key={`${variant}-${look}`} variant={variant} look={look}>
            {variant}
          </Badge>
        )),
      )}
    </Grid>
  ),
};

/**
 * Use the `shape` prop to control the corner radius.
 */
export const Shape: Story = {
  render: () => (
    <Grid cols={3}>
      {(["rounded", "pill", "square"] as const).map((shape) => (
        <Badge key={shape} shape={shape}>
          {shape}
        </Badge>
      ))}
    </Grid>
  ),
};

/**
 * Use the `size` prop to control the badge's padding and text size.
 */
export const Size: Story = {
  render: () => (
    <Grid cols={3}>
      {(["sm", "default", "lg"] as const).map((size) => (
        <Badge key={size} size={size}>
          {size}
        </Badge>
      ))}
    </Grid>
  ),
};

/**
 * Use the `dot` prop to show a small colored dot before the content instead
 * of filling the whole badge — pairs well with `look="soft"`.
 */
export const Dot: Story = {
  render: () => (
    <Grid cols={7}>
      {VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant} look="soft" dot>
          {variant}
        </Badge>
      ))}
    </Grid>
  ),
};

/**
 * Use `dot` with `pulse` for a live/status indicator — an animated ping
 * ring around the dot.
 */
export const Pulse: Story = {
  args: {
    variant: "success",
    look: "soft",
    dot: true,
    pulse: true,
    children: "Live",
  },
};

/**
 * Render an icon before the text.
 */
export const WithIcon: Story = {
  args: {
    variant: "primary",
    look: "soft",
    children: (
      <>
        <BadgeCheckIcon />
        Verified
      </>
    ),
  },
};

/**
 * Use the `dismissible` prop to show a close button. Uncontrolled by
 * default — the badge hides itself once dismissed.
 */
export const Dismissible: Story = {
  args: {
    variant: "secondary",
    dismissible: true,
    children: "Removable",
  },
};

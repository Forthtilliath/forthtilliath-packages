import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle2Icon, InfoIcon, TriangleAlertIcon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  type AlertVariants,
} from "@forthtilliath/forth-ui/components/alert";
import { Grid } from "@forthtilliath/forth-ui/components/grid";
import { Button } from "@forthtilliath/shadcn-ui/components/button";

const VARIANTS: NonNullable<AlertVariants["variant"]>[] = [
  "default",
  "primary",
  "success",
  "warning",
  "info",
  "destructive",
];
const LOOKS: NonNullable<AlertVariants["look"]>[] = [
  "solid",
  "soft",
  "outline",
];

/**
 * Displays a callout for user attention, with an optional icon, title,
 * description, action button and close button.
 */
const meta = {
  title: "forth-ui/Alert",
  component: Alert,
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
    size: {
      options: ["sm", "default", "lg"],
      control: { type: "radio" },
    },
  },
  args: {
    variant: "default",
    look: "soft",
    size: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <CheckCircle2Icon />
      <AlertTitle>Changes saved</AlertTitle>
      <AlertDescription>
        This is an alert with an icon, title and description.
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the alert, with an icon, title and description.
 */
export const Default: Story = {};

/**
 * Use the `variant` prop to convey semantic meaning (primary, success,
 * warning, info, destructive) and `look` to control how strongly it stands
 * out (solid, soft, outline).
 */
export const Colors: Story = {
  render: () => (
    <Grid cols={3}>
      {LOOKS.flatMap((look) =>
        VARIANTS.map((variant) => (
          <Alert key={`${look}-${variant}`} variant={variant} look={look}>
            <CheckCircle2Icon />
            <AlertTitle>
              {variant} / {look}
            </AlertTitle>
          </Alert>
        )),
      )}
    </Grid>
  ),
};

/**
 * Use the `size` prop to control the alert's padding and text size.
 */
export const Size: Story = {
  render: () => (
    <Grid cols={1}>
      {(["sm", "default", "lg"] as const).map((size) => (
        <Alert key={size} variant="info" size={size}>
          <InfoIcon />
          <AlertTitle>Size: {size}</AlertTitle>
        </Alert>
      ))}
    </Grid>
  ),
};

/**
 * Use the `dismissible` prop to show a close button. Uncontrolled by
 * default — the alert hides itself once dismissed.
 */
export const Dismissible: Story = {
  args: {
    variant: "warning",
    dismissible: true,
  },
  render: (args) => (
    <Alert {...args}>
      <TriangleAlertIcon />
      <AlertTitle>Your session is about to expire</AlertTitle>
      <AlertDescription>Save your work to avoid losing it.</AlertDescription>
    </Alert>
  ),
};

/**
 * Use the `action` prop to render a button (or any content) top-right,
 * alongside the close button when `dismissible` is also set.
 */
export const WithAction: Story = {
  args: {
    variant: "primary",
    dismissible: true,
    action: <Button size="sm">Upgrade</Button>,
  },
  render: (args) => (
    <Alert {...args}>
      <InfoIcon />
      <AlertTitle>A new version is available</AlertTitle>
      <AlertDescription>
        Upgrade now to get the latest features.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * An alert with only a title and icon, no description.
 */
export const NoDescription: Story = {
  render: (args) => (
    <Alert {...args}>
      <CheckCircle2Icon />
      <AlertTitle>This alert has a title and icon only.</AlertTitle>
    </Alert>
  ),
};

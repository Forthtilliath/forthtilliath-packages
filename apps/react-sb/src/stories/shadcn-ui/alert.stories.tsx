import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@forthtilliath/shadcn-ui/components/alert";

/**
 * Displays a callout for user attention, with an optional icon, title and description.
 */
const meta = {
  title: "shadcn-ui/Feedback/Alert",
  component: Alert,
  argTypes: {
    variant: {
      options: ["default", "destructive"],
      control: { type: "radio" },
    },
  },
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <CheckCircle2Icon />
      <AlertTitle>Success! Your changes have been saved</AlertTitle>
      <AlertDescription>
        This is an alert with icon, title and description.
      </AlertDescription>
    </Alert>
  ),
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the alert, with an icon, title and description.
 */
export const Default: Story = {};

/**
 * An alert with only a title and icon, and no description.
 */
export const NoDescription: Story = {
  render: (args) => (
    <Alert {...args}>
      <PopcornIcon />
      <AlertTitle>
        This Alert has a title and an icon. No description.
      </AlertTitle>
    </Alert>
  ),
};

/**
 * Use the `destructive` variant to indicate an error, such as a failed
 * action requiring user attention.
 */
export const Destructive: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertCircleIcon />
      <AlertTitle>Unable to process your payment.</AlertTitle>
      <AlertDescription>
        <p>Please verify your billing information and try again.</p>
        <ul className="list-inside list-disc text-sm">
          <li>Check your card details</li>
          <li>Ensure sufficient funds</li>
          <li>Verify billing address</li>
        </ul>
      </AlertDescription>
    </Alert>
  ),
  args: {
    variant: "destructive",
  },
};

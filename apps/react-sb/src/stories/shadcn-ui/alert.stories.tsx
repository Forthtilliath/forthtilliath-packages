import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@forthtilliath/shadcn-ui/components/alert";

const meta = {
  title: "shadcn-ui/Alert",
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

export const Default: Story = {};

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

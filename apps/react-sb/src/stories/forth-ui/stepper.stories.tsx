import type { Meta, StoryObj } from "@storybook/react-vite";

import { Stepper } from "@forthtilliath/forth-ui/components/stepper";

const STEPS = [
  { label: "Account", description: "Create your account" },
  { label: "Profile", description: "Tell us about yourself" },
  { label: "Payment", description: "Add a payment method" },
  { label: "Confirm", description: "Review and finish" },
];

/**
 * A numbered sequence of steps for a multi-stage flow, showing completed/
 * current/upcoming state.
 */
const meta = {
  title: "forth-ui/Stepper",
  component: Stepper,
  args: {
    steps: STEPS,
    value: 1,
  },
} satisfies Meta<typeof Stepper>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default, horizontal form.
 */
export const Default: Story = {};

/**
 * `orientation="vertical"` stacks the steps.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <div className="w-64">
      <Stepper {...args} />
    </div>
  ),
};

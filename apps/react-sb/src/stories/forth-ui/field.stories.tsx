import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field } from "@forthtilliath/forth-ui/components/field";
import { Checkbox } from "@forthtilliath/shadcn-ui/components/checkbox";
import { Input } from "@forthtilliath/shadcn-ui/components/input";

/**
 * Wires a label, description and error message to a single form control —
 * consolidates the "Field" pattern (label + control + description +
 * error) applied to any control type, independent of any form library.
 */
const meta = {
  title: "forth-ui/Field",
  component: Field,
  args: {
    label: "Username",
    children: <Input placeholder="octocat" />,
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default, vertical layout — label above the control.
 */
export const Default: Story = {};

/**
 * `description` adds helper text below the control.
 */
export const WithDescription: Story = {
  args: {
    description: "This is your public display name.",
  },
};

/**
 * `error` replaces/adds an error message and marks the control invalid
 * (`aria-invalid`).
 */
export const WithError: Story = {
  args: {
    error: "This username is already taken.",
  },
};

/**
 * `required` adds a visual marker next to the label.
 */
export const Required: Story = {
  args: {
    required: true,
  },
};

/**
 * `orientation="horizontal"` puts the control beside the label — the
 * shape used for `Checkbox`/`Switch`.
 */
export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    label: "Accept terms and conditions",
    description: "You agree to our Terms of Service and Privacy Policy.",
    children: <Checkbox />,
  },
};

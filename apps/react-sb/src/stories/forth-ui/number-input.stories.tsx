import type { Meta, StoryObj } from "@storybook/react-vite";

import { NumberInput } from "@forthtilliath/forth-ui/components/number-input";

/**
 * A numeric input with increment/decrement stepper buttons.
 */
const meta = {
  title: "forth-ui/NumberInput",
  component: NumberInput,
  args: {
    defaultValue: 1,
  },
} satisfies Meta<typeof NumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form — unbounded.
 */
export const Default: Story = {};

/**
 * `min`/`max` clamp the value and disable the corresponding button once
 * reached.
 */
export const MinMax: Story = {
  args: {
    min: 0,
    max: 5,
  },
};

/**
 * `disabled` freezes both buttons and the input.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

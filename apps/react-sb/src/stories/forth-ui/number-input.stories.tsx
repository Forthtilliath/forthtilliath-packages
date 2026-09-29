import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { NumberInput } from "@forthtilliath/forth-ui/components/number-input";

/**
 * A numeric input with increment/decrement stepper buttons.
 */
const meta = {
  title: "forth-ui/Forms/NumberInput",
  component: NumberInput,
  args: {
    defaultValue: 1,
    "aria-label": "Quantity",
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

export const ShouldStepWithinBounds: Story = {
  name: "when stepping up to max, should clamp and disable increment",
  tags: ["!dev", "!autodocs"],
  args: { min: 0, max: 2, defaultValue: 1, onValueChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole("spinbutton", { name: "Quantity" });
    const increment = canvas.getByRole("button", { name: "Increment" });

    await userEvent.click(increment);
    await expect(input).toHaveValue(2);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(2);
    await expect(increment).toBeDisabled();

    await userEvent.click(canvas.getByRole("button", { name: "Decrement" }));
    await expect(input).toHaveValue(1);
  },
};

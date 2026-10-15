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

export const ShouldClampOnlyOnBlur: Story = {
  name: "when typing, should keep the text free and clamp on blur",
  tags: ["!dev", "!autodocs"],
  args: { min: 128, max: 4096, defaultValue: 300, onValueChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole("spinbutton", { name: "Quantity" });

    await userEvent.clear(input);
    await userEvent.type(input, "600");
    await expect(input).toHaveValue(600);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(600);

    await userEvent.clear(input);
    await userEvent.type(input, "5");
    await userEvent.tab();
    await expect(input).toHaveValue(128);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(128);
  },
};

export const ShouldRoundDecimalSteps: Story = {
  name: "when stepping by a decimal step, should not leak float noise",
  tags: ["!dev", "!autodocs"],
  args: { min: 0, max: 1, step: 0.01, defaultValue: 0.4, onValueChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Increment" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(0.41);
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ColorPicker } from "@forthtilliath/forth-ui/components/color-picker";

/**
 * A color swatch + hex text input, kept in sync — built on the browser's
 * native `<input type="color">`.
 */
const meta = {
  title: "forth-ui/Forms/ColorPicker",
  component: ColorPicker,
  args: {
    defaultValue: "#6d28d9",
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Click the swatch for the native picker, or type a hex value directly.
 */
export const Default: Story = {};

/**
 * `disabled` freezes both the swatch and the text input.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

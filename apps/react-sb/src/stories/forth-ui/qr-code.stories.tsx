import type { Meta, StoryObj } from "@storybook/react-vite";

import { QrCode } from "@forthtilliath/forth-ui/components/qr-code";

/**
 * Generates a QR code from a string, rendered as SVG (no canvas — works in
 * Server Components too).
 */
const meta = {
  title: "forth-ui/QrCode",
  component: QrCode,
  argTypes: {
    robustness: {
      options: ["L", "M", "Q", "H"],
      control: { type: "radio" },
    },
  },
  args: {
    value: "https://forthtilliath.dev",
    className: "size-40",
  },
} satisfies Meta<typeof QrCode>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form.
 */
export const Default: Story = {};

/**
 * Use `foreground`/`background` to recolor the code.
 */
export const CustomColors: Story = {
  args: {
    foreground: "#7c3aed",
    background: "#f5f3ff",
  },
};

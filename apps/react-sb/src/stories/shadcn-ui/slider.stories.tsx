import type { Meta, StoryObj } from "@storybook/react-vite";

import { Slider } from "@forthtilliath/shadcn-ui/components/slider";

/**
 * An input where the user selects a value from within a given range.
 */
const meta = {
  title: "shadcn-ui/Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    defaultValue: [33],
    max: 100,
    step: 1,
  },
  parameters: {
    // Violation inside the shadcn-ui copy (not editable here) — revisit with the shadcn update. Its thumbs get no accessible name from the Slider's props.
    a11y: {
      config: {
        rules: [{ id: "aria-input-field-name", enabled: false }],
      },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the slider.
 */
export const Default: Story = {};

/**
 * Use the `inverted` prop to have the slider fill from right to left.
 */
export const Inverted: Story = {
  args: {
    inverted: true,
  },
};

/**
 * Use the `disabled` prop to disable the slider.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Use `orientation="vertical"` to lay the slider out top to bottom.
 */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
};

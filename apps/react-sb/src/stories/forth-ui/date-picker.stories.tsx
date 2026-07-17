import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker } from "@forthtilliath/forth-ui/components/date-picker";

/**
 * A single-date picker, wrapping shadcn-ui's `Popover` + `Calendar`
 * recipe into a `value`/`onValueChange` component.
 */
const meta = {
  title: "forth-ui/DatePicker",
  component: DatePicker,
  args: {
    className: "w-64",
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default, empty form.
 */
export const Default: Story = {};

/**
 * `defaultValue` pre-selects a date.
 */
export const WithDefaultValue: Story = {
  args: {
    defaultValue: new Date(2026, 6, 17),
  },
};

/**
 * `disabled` freezes the trigger.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

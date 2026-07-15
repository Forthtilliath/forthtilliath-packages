import type { Meta, StoryObj } from "@storybook/react-vite";
import { startOfYear } from "date-fns";
import { fn } from "storybook/test";

import { CalendarDatePicker } from "@forthtilliath/shadcn-ui/components/blocks/calendar-date-picker";

const today = new Date();

/**
 * A button that opens a popover with quick-pick ranges (Today, This Week,
 * This Month, ...) plus a two-month calendar and month/year selects for
 * picking a custom date range.
 */
const meta = {
  title: "shadcn-ui-blocks/CalendarDatePicker",
  component: CalendarDatePicker,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      description: "Styles the trigger button, same variants as `Button`.",
      control: { type: "select" },
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    numberOfMonths: {
      description:
        "`2` shows a date-range picker with two calendars side by side, `1` shows a single-day picker with one calendar.",
      control: { type: "radio" },
      options: [1, 2],
    },
    closeOnSelect: {
      description: "Close the popover automatically once a range is picked.",
      control: "boolean",
    },
    yearsRange: {
      description: "Number of years listed in the year select, before and after the current year.",
      control: { type: "number" },
    },
  },
  args: {
    date: { from: startOfYear(today), to: today },
    numberOfMonths: 2,
    yearsRange: 10,
    closeOnSelect: false,
    onDateSelect: fn(),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof CalendarDatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default range picker: two calendars, quick-pick presets from "Today" to
 * "This Year".
 */
export const Default: Story = {};

/**
 * Use `numberOfMonths={1}` for a single-day picker — one calendar, and the
 * quick-pick presets are limited to single-day ranges (Today, Yesterday).
 */
export const SingleDay: Story = {
  args: {
    numberOfMonths: 1,
    date: { from: today, to: today },
  },
};

/**
 * Set `closeOnSelect` to close the popover as soon as a full range has been
 * picked, instead of leaving it open for further adjustment.
 */
export const CloseOnSelect: Story = {
  args: {
    closeOnSelect: true,
  },
};

/**
 * Use the `destructive` variant to draw attention to the picker, e.g. to
 * flag a required or invalid date range.
 */
export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

/**
 * Use the `outline` variant for a lower-emphasis trigger button.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

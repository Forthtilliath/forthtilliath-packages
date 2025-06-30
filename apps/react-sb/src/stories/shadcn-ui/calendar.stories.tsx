import type { Meta, StoryObj } from "@storybook/react-vite";
import { addDays } from "date-fns";
import { fn } from "storybook/test";
import { expect } from "storybook/test";

import { Calendar } from "@forthtilliath/shadcn-ui/components/calendar";

/**
 * A date field component that allows users to enter and edit date.
 */
const meta = {
  title: "shadcn-ui/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  args: {
    mode: "single",
    selected: new Date(),
    className: "rounded-md border w-fit",
    onSelect: fn(),
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the calendar.
 */
export const Default: Story = {};

/**
 * Use the `multiple` mode to select multiple dates.
 */
export const Multiple: Story = {
  args: {
    min: 1,
    selected: [new Date(), addDays(new Date(), 2), addDays(new Date(), 8)],
    mode: "multiple",
  },
};

/**
 * Use the `range` mode to select a range of dates.
 */
export const Range: Story = {
  args: {
    selected: {
      from: new Date(),
      to: addDays(new Date(), 7),
    },
    mode: "range",
  },
};

/**
 * Use the `disabled` prop to disable specific dates.
 */
export const Disabled: Story = {
  args: {
    disabled: [
      addDays(new Date(), 1),
      addDays(new Date(), 2),
      addDays(new Date(), 3),
      addDays(new Date(), 5),
    ],
  },
};

/**
 * Use the `numberOfMonths` prop to display multiple months.
 */
export const MultipleMonths: Story = {
  args: {
    numberOfMonths: 2,
    showOutsideDays: false,
  },
};

export const MonthAndYearSelector: Story = {
  args: {
    captionLayout: "dropdown",
  },
};

export const ShouldChangeMonths: Story = {
  name: "when using the calendar navigation, should change months",
  tags: ["dev", "!autodocs"],
  args: {
    defaultMonth: new Date(2025, 8),
  },
  play: async ({ canvas, userEvent }) => {
    const title = await canvas.findByText(/2025/i);
    const startTitle = title.textContent ?? "";
    const backBtn = await canvas.findByRole("button", { name: /previous/i });
    const nextBtn = await canvas.findByRole("button", { name: /next/i });
    const steps = 6;
    for (let i = 0; i < steps / 2; i++) {
      await userEvent.click(backBtn);
      await expect(title).not.toHaveTextContent(startTitle);
    }
    for (let i = 0; i < steps; i++) {
      await userEvent.click(nextBtn);
      if (i == steps / 2 - 1) {
        await expect(title).toHaveTextContent(startTitle);
        continue;
      }
      await expect(title).not.toHaveTextContent(startTitle);
    }
  },
};

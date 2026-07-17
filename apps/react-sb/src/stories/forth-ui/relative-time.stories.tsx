import type { Meta, StoryObj } from "@storybook/react-vite";

import { RelativeTime } from "@forthtilliath/forth-ui/components/relative-time";

/**
 * Displays a time — live-updating and defaulting to the local timezone
 * unless given a fixed `date`/`timeZone`.
 */
const meta = {
  title: "forth-ui/RelativeTime",
  component: RelativeTime,
} satisfies Meta<typeof RelativeTime>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * An auto-updating live clock, in the viewer's local timezone.
 */
export const Live: Story = {};

/**
 * Several timezones side by side, each with a `label` and a fixed `date` so
 * they stay in sync with each other.
 */
export const MultipleTimezones: Story = {
  render: () => {
    const date = new Date();
    return (
      <div className="flex gap-6">
        <RelativeTime
          label="New York"
          date={date}
          timeZone="America/New_York"
        />
        <RelativeTime label="London" date={date} timeZone="Europe/London" />
        <RelativeTime label="Tokyo" date={date} timeZone="Asia/Tokyo" />
      </div>
    );
  },
};

/**
 * Use `formatOptions` for a longer, more descriptive format.
 */
export const LongFormat: Story = {
  args: {
    formatOptions: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  },
};

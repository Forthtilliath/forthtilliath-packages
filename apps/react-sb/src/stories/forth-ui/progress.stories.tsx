import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid } from "@forthtilliath/forth-ui/components/grid";
import { Progress } from "@forthtilliath/forth-ui/components/progress";

/**
 * Displays an indicator showing the completion progress of a task.
 */
const meta = {
  title: "forth-ui/Feedback/Progress",
  component: Progress,
  argTypes: {
    variant: {
      options: [
        "default",
        "primary",
        "success",
        "warning",
        "info",
        "destructive",
      ],
      control: { type: "select" },
    },
    size: {
      options: ["sm", "default", "lg"],
      control: { type: "radio" },
    },
  },
  args: {
    value: 60,
    variant: "default",
    size: "default",
    className: "w-80",
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form.
 */
export const Default: Story = {};

/**
 * Every color variant, at the same value.
 */
export const Colors: Story = {
  render: (args) => (
    <Grid cols={1}>
      {(
        [
          "default",
          "primary",
          "success",
          "warning",
          "info",
          "destructive",
        ] as const
      ).map((variant) => (
        <Progress key={variant} {...args} variant={variant} />
      ))}
    </Grid>
  ),
};

/**
 * Use `label` and/or `showValue` to render text above the bar.
 */
export const WithLabel: Story = {
  args: {
    label: "Uploading...",
    showValue: true,
    value: 72,
  },
};

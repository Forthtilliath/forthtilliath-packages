import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid } from "@forthtilliath/forth-ui/components/grid";
import { Spinner } from "@forthtilliath/forth-ui/components/spinner";

/**
 * An accessible loading indicator, in one of a few visual styles.
 */
const meta = {
  title: "forth-ui/Spinner",
  component: Spinner,
  argTypes: {
    variant: {
      options: ["default", "ring", "bars", "ellipsis"],
      control: { type: "radio" },
    },
    size: {
      options: ["sm", "default", "lg"],
      control: { type: "radio" },
    },
  },
  args: {
    variant: "default",
    size: "default",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form.
 */
export const Default: Story = {};

/**
 * Every visual variant, at the default size.
 */
export const Variants: Story = {
  render: () => (
    <Grid cols={4}>
      {(["default", "ring", "bars", "ellipsis"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Spinner variant={variant} />
          <span className="text-muted-foreground text-xs">{variant}</span>
        </div>
      ))}
    </Grid>
  ),
};

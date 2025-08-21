import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid } from "@forthtilliath/forth-ui/components/grid";
import { Repeat } from "@forthtilliath/forth-ui/components/repeat";

/**
 * A grid layout component with optional debug mode.
 */
const meta: Meta<typeof Grid> = {
  title: "forth-ui/Grid",
  component: Grid,
  argTypes: {
    cols: {
      description: "Number of columns",
      control: "select",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      table: {
        category: "Grid",
        type: { summary: "1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12" },
        defaultValue: { summary: "12" },
      },
    },
    className: {
      description: "Custom classname",
      table: {
        category: "Grid",
        defaultValue: { summary: "undefined" },
      },
    },
    debug: {
      description: "Enable debug mode",
      control: "boolean",
      table: {
        category: "Debug",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    debugKey: {
      description: "Custom debug key",
      control: "text",
      if: { arg: "debug" },
      table: {
        category: "Debug",
        type: { summary: "string" },
        defaultValue: { summary: "g" },
      },
    },
  },
  args: {
    className: ["[&_[data-slot=grid-item]]:p-2"],
  },
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <Grid {...args}>
      <Repeat count={24}>{(i) => <Grid.Item>{i + 1}</Grid.Item>}</Repeat>
    </Grid>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Display grid with default values
 */
export const Default: Story = {};

/**
 * Display grid with 6 columns.
 */
export const SixColumns: Story = {
  args: {
    cols: 6,
  },
};

/**
 * Display grid with debug mode. Press `g` to toggle.
 */
export const Debug: Story = {
  args: {
    debug: true,
  },
};

/**
 * Use ``debugKey`` prop to display grid with custom debug key. Press `p` to toggle.
 */
export const CustomDebugKey: Story = {
  args: {
    debug: true,
    debugKey: "p",
  },
};

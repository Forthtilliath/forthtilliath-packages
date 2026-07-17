import type { Meta, StoryObj } from "@storybook/react-vite";

import { Grid } from "@forthtilliath/forth-ui/components/grid";
import { Repeat } from "@forthtilliath/forth-ui/components/repeat";

/**
 * A grid layout component with optional debug mode.
 */
const meta: Meta<typeof Grid> = {
  title: "forth-ui/Layout/Grid",
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
    spacing: {
      description: "Gap between grid items",
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
      table: {
        category: "Grid",
        type: { summary: "none | xs | sm | md | lg | xl" },
        defaultValue: { summary: "md" },
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
      <Repeat count={24} renderItem={(i) => <Grid.Item>{i + 1}</Grid.Item>} />
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
 * Use the `spacing` prop to control the gap between grid items, from `none`
 * up to `xl`.
 */
export const Spacing: Story = {
  args: {
    spacing: "xl",
  },
};

/**
 * Give individual `Grid.Item`s an explicit `cols` prop to span multiple
 * columns instead of the default single column.
 */
export const ColumnSpan: Story = {
  render: (args) => (
    <Grid {...args}>
      <Grid.Item cols="6">1</Grid.Item>
      <Grid.Item cols="6">2</Grid.Item>
      <Grid.Item cols="4">3</Grid.Item>
      <Grid.Item cols="4">4</Grid.Item>
      <Grid.Item cols="4">5</Grid.Item>
      <Grid.Item cols="full">6</Grid.Item>
    </Grid>
  ),
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

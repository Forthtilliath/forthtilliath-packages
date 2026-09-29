import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import type { ToggleSwitchProps } from "@forthtilliath/forth-ui/components/toggle-switch";
import { ToggleSwitch } from "@forthtilliath/forth-ui/components/toggle-switch";

/**
 * An on/off switch with an optional visible label and description.
 */
const meta = {
  title: "forth-ui/Forms/ToggleSwitch",
  component: ToggleSwitch,
  args: {
    checked: false,
    onCheckedChange: () => undefined,
    label: "Recurring event",
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

function ToggleSwitchExample({
  initialChecked = false,
  ...props
}: Omit<ToggleSwitchProps, "checked" | "onCheckedChange"> & {
  initialChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(initialChecked);
  return (
    <ToggleSwitch {...props} checked={checked} onCheckedChange={setChecked} />
  );
}

/**
 * Click the switch or its label to toggle it.
 */
export const Default: Story = {
  render: () => <ToggleSwitchExample label="Recurring event" />,
};

/**
 * The three sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ToggleSwitchExample size="sm" initialChecked label="Small" />
      <ToggleSwitchExample initialChecked label="Default" />
      <ToggleSwitchExample size="lg" initialChecked label="Large" />
    </div>
  ),
};

/**
 * A settings row: text first, description under the label, full width.
 */
export const SettingsRow: Story = {
  render: () => (
    <ToggleSwitchExample
      size="lg"
      initialChecked
      label="Email address"
      description="Visible to other members"
      labelPosition="start"
      className={{ root: "w-80 justify-between gap-4", label: "font-medium" }}
    />
  ),
};

/**
 * Style any part per state through the `group/toggle-switch` data attribute.
 */
export const DimmedWhenOff: Story = {
  render: () => (
    <ToggleSwitchExample
      label="Active"
      className={{
        label:
          "text-muted-foreground group-data-[state=checked]/toggle-switch:text-foreground text-xs",
      }}
    />
  ),
};

/**
 * Without a visible label, give it an accessible name.
 */
export const IconOnly: Story = {
  render: () => <ToggleSwitchExample aria-label="Enable notifications" />,
};

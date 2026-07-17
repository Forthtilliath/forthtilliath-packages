import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@forthtilliath/forth-ui/components/button";
import { CountAnimation } from "@forthtilliath/forth-ui/components/count-animation";

/**
 * Animates a number counting up (or down) to `value` whenever it changes.
 */
const meta = {
  title: "forth-ui/Feedback/CountAnimation",
  component: CountAnimation,
  args: {
    value: 1234,
    className: "text-3xl font-bold tabular-nums",
  },
} satisfies Meta<typeof CountAnimation>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Animates once, from 0 to `value`, on mount.
 */
export const Default: Story = {};

function InteractiveExample() {
  const [value, setValue] = React.useState(1234);

  return (
    <div className="flex items-center gap-4">
      <CountAnimation
        value={value}
        className="w-24 text-3xl font-bold tabular-nums"
      />
      <Button
        onClick={() => {
          setValue(Math.floor(Math.random() * 10000));
        }}
      >
        Randomize
      </Button>
    </div>
  );
}

/**
 * Click the button to animate to a new random value.
 */
export const Interactive: Story = {
  render: () => <InteractiveExample />,
};

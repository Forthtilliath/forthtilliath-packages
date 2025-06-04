import { SlotOrCallback, type SlotOrCallbackProps } from "@forthtilliath/react-ui/slot-or-callback";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SlotOrCallback> = {
  title: "Ui/SlotOrCallback",
  component: SlotOrCallback,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  render: ({ children }: SlotOrCallbackProps) => (
    <SlotOrCallback>
      {children}
    </SlotOrCallback>
  ),
};

export default meta;
type Story = StoryObj<typeof SlotOrCallback>;

export const Default: Story = {
  args: {
    children: (
      <p>Without callback function</p>
    ),
  },
};

export const WithCallback: Story = {
  args: {
    children: (i: number) => <p>Message répété plusieurs fois {i}</p>,
  },
};


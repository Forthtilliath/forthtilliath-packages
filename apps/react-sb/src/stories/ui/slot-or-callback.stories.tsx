import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  SlotOrCallback,
  type SlotOrCallbackProps,
} from "@forthtilliath/react-kit/slot-or-callback";

// `SlotOrCallback` is generic over the render function's parameters: pin them
// to `[number]` so the `WithCallback` story's `children` and `args` agree.
type Args = [number];

const meta: Meta<typeof SlotOrCallback<Args>> = {
  title: "Ui/SlotOrCallback",
  component: SlotOrCallback<Args>,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  render: ({ children, args }: SlotOrCallbackProps<Args>) => (
    <SlotOrCallback args={args}>{children}</SlotOrCallback>
  ),
};

export default meta;
type Story = StoryObj<typeof SlotOrCallback<Args>>;

export const Default: Story = {
  args: {
    children: <p>Without callback function</p>,
  },
};

/**
 * When `children` is a function, it is called with `args`.
 */
export const WithCallback: Story = {
  args: {
    args: [3],
    children: (i: number) => <p>Message avec l&apos;argument {i}</p>,
  },
};

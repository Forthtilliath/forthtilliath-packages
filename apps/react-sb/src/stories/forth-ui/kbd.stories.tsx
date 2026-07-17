import type { Meta, StoryObj } from "@storybook/react-vite";

import { Kbd, KbdGroup } from "@forthtilliath/forth-ui/components/kbd";

/**
 * Displays which key or combination of keys performs a given action.
 */
const meta = {
  title: "forth-ui/Kbd",
  component: Kbd,
  args: {
    children: "K",
  },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A single key.
 */
export const Default: Story = {};

/**
 * Use `KbdGroup` to display a key combination.
 */
export const Combination: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>Shift</Kbd>
      <span>+</span>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
};

/**
 * Common special key symbols.
 */
export const Symbols: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
    </div>
  ),
};

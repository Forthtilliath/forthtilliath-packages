import type { Meta, StoryObj } from "@storybook/react-vite";

import { Chip } from "@forthtilliath/forth-ui/components/chip";

/**
 * A compact, interactive element for displaying status, categories, or
 * filters — `Badge` with an optional avatar slot for tagging people/entities.
 */
const meta = {
  title: "forth-ui/Chip",
  component: Chip,
  args: {
    children: "Chip",
    variant: "secondary",
    look: "soft",
    shape: "pill",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the chip — all of `Badge`'s props (`variant`, `look`,
 * `shape`, `size`, `dot`, `dismissible`) apply here too.
 */
export const Default: Story = {};

/**
 * Use the `avatar` prop to tag a person or entity.
 */
export const WithAvatar: Story = {
  args: {
    avatar: {
      src: "https://github.com/shadcn.png",
      alt: "@shadcn",
      fallback: "SC",
    },
    children: "shadcn",
  },
};

/**
 * Combine `avatar` with `dismissible` — a removable person tag, e.g. in a
 * "share with" or assignee picker.
 */
export const RemovablePerson: Story = {
  args: {
    avatar: {
      fallback: "VD",
    },
    dismissible: true,
    children: "Vincent",
  },
};

/**
 * Use `isDisabled` to prevent interaction and dim the chip.
 */
export const Disabled: Story = {
  args: {
    isDisabled: true,
    dismissible: true,
    children: "Disabled",
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Combobox } from "@forthtilliath/forth-ui/components/combobox";

const FRAMEWORKS = [
  { label: "Next.js", value: "next" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Nuxt.js", value: "nuxt" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
];

/**
 * An autocomplete/searchable select, wrapping shadcn-ui's `Popover` +
 * `Command` recipe into an `options`/`value`/`onValueChange` component.
 */
const meta = {
  title: "forth-ui/Combobox",
  component: Combobox,
  args: {
    options: FRAMEWORKS,
    placeholder: "Select framework…",
    className: "w-64",
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Open the popover and type to filter.
 */
export const Default: Story = {};

/**
 * `disabled` freezes the trigger.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

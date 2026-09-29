import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";

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
  title: "forth-ui/Forms/Combobox",
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

export const ShouldSelectOption: Story = {
  name: "when filtering then picking an option, should report its value",
  tags: ["!dev", "!autodocs"],
  args: { onValueChange: fn() },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    // The options render in a portal, outside the story's canvas.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("combobox"));
    await userEvent.type(body.getByPlaceholderText("Select framework…"), "rem");
    await expect(body.queryByRole("option", { name: "Astro" })).toBeNull();
    await userEvent.click(await body.findByRole("option", { name: "Remix" }));
    await expect(args.onValueChange).toHaveBeenCalledWith("remix");
  },
};

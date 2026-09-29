import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";

import { MultiSelect } from "@forthtilliath/forth-ui/components/combobox";

const LABELS = [
  { label: "Bug", value: "bug" },
  { label: "Feature", value: "feature" },
  { label: "Documentation", value: "docs" },
  { label: "Won't fix", value: "wontfix" },
  { label: "Duplicate", value: "duplicate" },
];

/**
 * `Combobox`'s multi-value sibling — selected options render as removable
 * `Badge` chips in the trigger.
 */
const meta = {
  title: "forth-ui/Forms/MultiSelect",
  component: MultiSelect,
  args: {
    options: LABELS,
    defaultValue: ["bug", "feature"],
    placeholder: "Select labels…",
    className: "w-72",
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Click a chip's close icon to remove it, or open the popover to add more.
 */
export const Default: Story = {};

/**
 * No selection yet — shows the placeholder.
 */
export const Empty: Story = {
  args: {
    defaultValue: [],
  },
};

export const ShouldToggleOptions: Story = {
  name: "when toggling options, should add and remove their badges",
  tags: ["!dev", "!autodocs"],
  args: { onValueChange: fn() },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("combobox"));

    await userEvent.click(
      await body.findByRole("option", { name: /Documentation/ }),
    );
    await expect(args.onValueChange).toHaveBeenLastCalledWith([
      "bug",
      "feature",
      "docs",
    ]);

    await userEvent.click(body.getByRole("option", { name: /Bug/ }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith([
      "feature",
      "docs",
    ]);
  },
};

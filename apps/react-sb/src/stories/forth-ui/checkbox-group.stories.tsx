import type { Meta, StoryObj } from "@storybook/react-vite";

import { CheckboxGroup } from "@forthtilliath/forth-ui/components/checkbox";

/**
 * A group of `Checkbox`es sharing a single array value.
 */
const meta = {
  title: "forth-ui/Forms/CheckboxGroup",
  component: CheckboxGroup,
  args: {
    options: [
      { label: "Bug", value: "bug" },
      { label: "Feature", value: "feature" },
      { label: "Documentation", value: "docs" },
      { label: "Won't fix", value: "wontfix", disabled: true },
    ],
    defaultValue: ["bug"],
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default, vertical form.
 */
export const Default: Story = {};

/**
 * `orientation="horizontal"` flows the options in a wrapping row.
 */
export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
};

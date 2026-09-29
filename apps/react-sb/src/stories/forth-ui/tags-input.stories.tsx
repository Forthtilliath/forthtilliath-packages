import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { TagsInput } from "@forthtilliath/forth-ui/components/tags-input";

/**
 * A flexible input for adding/removing multiple tags — `Enter`/`,` commits
 * the current text, `Backspace` on empty removes the last tag.
 */
const meta = {
  title: "forth-ui/Forms/TagsInput",
  component: TagsInput,
  args: {
    className: "w-96",
    defaultValue: ["react", "typescript"],
  },
} satisfies Meta<typeof TagsInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Type a tag and press Enter (or `,`) to add it.
 */
export const Default: Story = {};

/**
 * `max` caps the number of tags.
 */
export const MaxTags: Story = {
  args: {
    max: 3,
  },
};

export const ShouldAddAndRemoveTags: Story = {
  name: "when pressing Enter then Backspace, should add then remove a tag",
  tags: ["!dev", "!autodocs"],
  args: { onValueChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Add a tag" });

    await userEvent.type(input, "vue{Enter}");
    await expect(canvas.getByText("vue")).toBeInTheDocument();
    await expect(args.onValueChange).toHaveBeenLastCalledWith([
      "react",
      "typescript",
      "vue",
    ]);

    await userEvent.type(input, "{Backspace}");
    await expect(canvas.queryByText("vue")).not.toBeInTheDocument();
  },
};

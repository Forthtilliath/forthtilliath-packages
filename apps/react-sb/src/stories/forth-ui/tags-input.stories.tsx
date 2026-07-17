import type { Meta, StoryObj } from "@storybook/react-vite";

import { TagsInput } from "@forthtilliath/forth-ui/components/tags-input";

/**
 * A flexible input for adding/removing multiple tags — `Enter`/`,` commits
 * the current text, `Backspace` on empty removes the last tag.
 */
const meta = {
  title: "forth-ui/TagsInput",
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

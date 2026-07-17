import type { Meta, StoryObj } from "@storybook/react-vite";

import { ImageInput } from "@forthtilliath/forth-ui/components/image-input";

/**
 * A click-to-upload image picker with a live preview.
 */
const meta = {
  title: "forth-ui/Forms/ImageInput",
  component: ImageInput,
  args: {
    className: "w-72",
  },
} satisfies Meta<typeof ImageInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Click to select an image file.
 */
export const Default: Story = {};

/**
 * `value` previews an existing image URL (e.g. editing something that
 * already has one).
 */
export const WithExistingImage: Story = {
  args: {
    value: "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400",
  },
};

/**
 * `disabled` freezes the control.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

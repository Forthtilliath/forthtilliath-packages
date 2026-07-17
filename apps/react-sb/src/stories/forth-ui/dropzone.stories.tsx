import type { Meta, StoryObj } from "@storybook/react-vite";

import { Dropzone } from "@forthtilliath/forth-ui/components/dropzone";

/**
 * A drag-and-drop file upload zone, listing accepted files below.
 */
const meta = {
  title: "forth-ui/Dropzone",
  component: Dropzone,
  args: {
    className: "w-96",
  },
} satisfies Meta<typeof Dropzone>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Drag a file over the zone, or click to open the file picker.
 */
export const Default: Story = {};

/**
 * `maxSize` silently drops oversized files and shows the limit.
 */
export const WithMaxSize: Story = {
  args: {
    maxSize: 5 * 1024 * 1024,
  },
};

/**
 * `disabled` freezes the zone.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "@forthtilliath/forth-ui/components/avatar";

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 */
const meta = {
  title: "forth-ui/Avatar",
  component: Avatar,
  argTypes: {
    src: {
      description: "The source URL of the image.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Required" },
      },
    },
    alt: {
      description: "The alt text for the image (2 letters if possible).",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Required" },
      },
    },
    status: {
      description: "The status of the user.",
      table: {
        type: { summary: "online | offline | away | busy | undefined" },
      },
      options: [undefined, "online", "offline", "away", "busy"],
      control: {
        type: "select",
        labels: {
          online: "Online",
          offline: "Offline",
          away: "Away",
          busy: "Busy",
          undefined: "None",
        },
      },
    },
    position: {
      description: "The position of the status indicator.",
      table: {
        type: { summary: "top-right | bottom-right | bottom-left | top-left | undefined" },
      },
      options: [
        undefined,
        "top-right",
        "bottom-right",
        "bottom-left",
        "top-left",
      ],
      control: {
        type: "select",
        labels: {
          "top-right": "Top Right",
          "bottom-right": "Bottom Right",
          "bottom-left": "Bottom Left",
          "top-left": "Top Left",
          undefined: "None",
        },
      },
    },
  },
  args: {
    src: "https://github.com/shadcn.png",
    alt: "@shadcn",
    fallback: "CN",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default avatar with default styles.
 */
export const Default: Story = {};

/**
 * Use the `status` prop to add a status indicator to the avatar.
 */
export const Status: Story = {
  args: {
    status: "away",
    position: "bottom-right",
  },
};

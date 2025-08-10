import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Avatar,
  type AvatarProps,
} from "@forthtilliath/forth-ui/components/avatar";

import { decoratorGroupStories } from "../../decorators/group-stories";

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 */
const meta = {
  title: "forth-ui/Avatar",
  component: Avatar,
  argTypes: {
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
      if: { arg: "status", truthy: true },
      table: {
        type: {
          summary:
            "top-right | bottom-right | bottom-left | top-left | undefined",
        },
        defaultValue: { summary: "bottom-right" },
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
    shape: {
      options: ["square", "rounded", "circle"],
      control: {
        type: "radio",
        labels: {
          square: "Square",
          rounded: "Rounded",
          circle: "Circle",
        },
      },
      table: {
        type: {
          summary: "square | rounded | circle",
        },
        defaultValue: { summary: "circle" },
      },
    },
  },
  args: {
    className: { root: "size-16" },
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

// const

/**
 * Default avatar with default styles.
 */
export const Default: Story = {};

/**
 * Display a fallback character instead of an image.
 */
export const Fallback: Story = {
  args: {
    src: undefined,
  },
};

export const Shape: Story = {
  decorators: [
    decoratorGroupStories<AvatarProps>(
      {
        ...meta.args,
        className: { root: "size-16" },
      },
      {
        src: ["https://github.com/shadcn.png", undefined],
        shape: ["square", "rounded", "circle"],
      }
    ),
  ],
};

/**
 * Use the `status` prop to add a status indicator to the avatar.
 */
export const Status: Story = {
  args: {
    status: "away",
    position: "bottom-right",
  },
};

/**
 * Use the `status` prop to add a status indicator to the avatar.
 */
export const WithRing: Story = {
  args: {
    ring: true,
    className: {
      root: "ring-red-500",
    },
  },
};

export const WithRing2: Story = {
  decorators: [
    decoratorGroupStories<AvatarProps>(
      {
        ...meta.args,
        ring: true,
      },
      {
        src: ["https://github.com/shadcn.png", undefined],
        shape: ["square", "rounded", "circle"],
        className: [
          undefined,
          {
            root: "ring-red-500",
          },
        ],
      }
    ),
  ],
};

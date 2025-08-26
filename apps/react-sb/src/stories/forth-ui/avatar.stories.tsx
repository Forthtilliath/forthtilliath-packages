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

/**
 * Use the `fallbackVariant` prop to change the fallback color.
 */
export const FallbackColor: Story = {
  decorators: [
    decoratorGroupStories<AvatarProps>(
      {
        ...meta.args,
        src: undefined,
      },
      {
        fallbackVariant: [
          "emerald",
          "yellow",
          "indigo",
          "rose",
          "slate",
          "sky",
          "emerald-full",
          "yellow-full",
          "indigo-full",
          "rose-full",
          "slate-full",
          "sky-full",
        ],
      },
      { cols: 6 }
    ),
  ],
};

/**
 * Use the `shape` prop to change the shape of the avatar.
 */
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
      },
      { cols: 3 }
    ),
  ],
};

/**
 * Use the `status` prop to add a status indicator to the avatar.
 */
export const Status: Story = {
  decorators: [
    decoratorGroupStories<AvatarProps>(
      {
        ...meta.args,
        className: { root: "size-16" },
      },
      {
        status: ["offline", "busy", "away", "online"],
      },
      { cols: 4 }
    ),
  ],
};

/**
 * Use the `ring` prop to add a ring to the avatar. You can also use the `className.root` prop to change the color of the ring.
 */
export const Ring: Story = {
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
      },
      { cols: 6 }
    ),
  ],
};

export const Tooltip: Story = {
  args: {
    renderTooltip: () => <p>@shadcn</p>,
  },
};

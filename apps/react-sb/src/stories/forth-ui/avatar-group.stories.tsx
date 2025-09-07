import type { Meta, StoryObj } from "@storybook/react-vite";

import { AvatarGroup } from "@forthtilliath/forth-ui/components/avatar";

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 */
const meta = {
  title: "forth-ui/AvatarGroup",
  component: AvatarGroup,
  argTypes: {
    avatars: {
      control: false,
    },
  },
  args: {
    avatars: [
      {
        src: "https://bundui-images.netlify.app/avatars/06.png",
        alt: "Avatar 06",
        fallback: "@shadcn06",
        // renderTooltip: () => <p>@shadcn</p>,
      },
      {
        src: "https://bundui-images.netlify.app/avatars/07.png",
        alt: "Avatar 07",
        fallback: "@shadcn07",
        // renderTooltip: () => <p>@shadcn</p>,
      },
      {
        src: "https://bundui-images.netlify.app/avatars/10.png",
        alt: "Avatar 10",
        fallback: "@shadcn10",
        // renderTooltip: () => <p>@shadcn</p>,
      },
    ],
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default form of the avatar group.
 */
export const Default: Story = {};

/**
 * Use the `outline` variant to create an outline styled accordion.
 * This variant displays a minimal outline style for the accordion items.
 */
export const Outline: Story = {
  args: {},
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { AvatarGroup } from "@forthtilliath/forth-ui/components/avatar";

/**
 * Displays a stack of overlapping avatars, each rendered as an `Avatar` from
 * the `avatars` prop.
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
 * Use the `max` prop to collapse avatars beyond that count into a "+N"
 * indicator, matching the `avatars` array's order.
 */
export const Max: Story = {
  args: {
    max: 3,
    avatars: [
      ...meta.args.avatars,
      {
        src: "https://bundui-images.netlify.app/avatars/08.png",
        alt: "Avatar 08",
        fallback: "@shadcn08",
      },
      {
        src: "https://bundui-images.netlify.app/avatars/09.png",
        alt: "Avatar 09",
        fallback: "@shadcn09",
      },
    ],
  },
};

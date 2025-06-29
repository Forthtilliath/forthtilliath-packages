import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@forthtilliath/shadcn-ui/components/avatar";

/**
 * An image element with a fallback for representing the user.
 */
const meta = {
  title: "shadcn-ui/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the avatar.
 */
export const Default: Story = {
  args: {
    className: "size-24",
  },
};

export const WithErrorImage: Story = {
  args: {
    className: "size-24",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://githb.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Rounded: Story = {
  args: {
    className: "size-24 rounded-lg",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.cm/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Linked: Story = {
  args: {
    className: "size-24",
  },
  render: (args) => (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-8 *:data-[slot=avatar]:ring-4 *:data-[slot=avatar]:grayscale">
      <Avatar {...args}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
        <AvatarFallback>LR</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarImage
          src="https://github.com/evilrabbit.png"
          alt="@evilrabbit"
        />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
    </div>
  ),
};

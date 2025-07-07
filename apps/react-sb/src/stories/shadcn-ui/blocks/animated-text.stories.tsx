import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnimatedText } from "@forthtilliath/shadcn-ui/components/blocks/animated-text";

const meta = {
  title: "shadcn-ui-blocks/AnimatedText",
  component: AnimatedText,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
    },
    variant: {
      control: { type: "select" },
      options: ["circle", "reveal", "ripple", "scramble", "split"],
    },
  },
  args: {},
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AnimatedText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Circle: Story = {
  args: {
    variant: "circle",
    children: "BERLIX UI * BERLIX UI * ",
    className: "font-black text-3xl",
  },
};

export const Reveal: Story = {
  args: {
    variant: "reveal",
    from: "top",
    split: "word",
    blur: 3,
    delay: 0.2,
    duration: 1.2,
    children:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias, rem. ",
    className:
      "font-medium text-2xl bg-gradient-to-b from-amber-200 via-orange-400 to-red-600 bg-clip-text text-transparent",
  },
};

export const Ripple: Story = {
  args: {
    variant: "ripple",
    children: "Labyrinth",
    className: "uppercase text-8xl font-normal text-zinc-900 dark:text-zinc-50",
  },
};

export const Scramble: Story = {
  args: {
    variant: "scramble",
    children: "Its over 9000!",
    className: "font-mono text-7xl uppercase",
  },
};

export const Split: Story = {
  args: {
    variant: "split",
    children: "Berlix UI",
    className: "text-9xl font-semibold uppercase",
    topClassName: "text-red-500",
    bottomClassName: "text-zinc-950 dark:text-zinc-50",
  },
};

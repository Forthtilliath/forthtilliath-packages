import type { Meta, StoryObj } from "@storybook/react-vite";

import { Marquee } from "@forthtilliath/forth-ui/components/marquee";

const LOGOS = [
  "React",
  "TypeScript",
  "Tailwind",
  "Vite",
  "Storybook",
  "Turborepo",
];

/**
 * Infinitely scrolls its children (a logo wall, a ticker).
 */
const meta = {
  title: "forth-ui/Layout/Marquee",
  component: Marquee,
  args: {
    className: "w-96",
    children: LOGOS.map((logo) => (
      <span
        key={logo}
        className="text-muted-foreground px-4 text-sm font-medium"
      >
        {logo}
      </span>
    )),
  },
} satisfies Meta<typeof Marquee>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default, left-scrolling form.
 */
export const Default: Story = {};

/**
 * `pauseOnHover` freezes the animation while the pointer is over it.
 */
export const PauseOnHover: Story = {
  args: {
    pauseOnHover: true,
  },
};

/**
 * `reverse` scrolls right-to-left instead.
 */
export const Reverse: Story = {
  args: {
    reverse: true,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { GradientFrame } from "@forthtilliath/forth-ui/components/gradient-frame";

import { Photo } from "./gradient-frame.fixtures";

/**
 * A visual (photo, video, card…) laid on a rounded, gradient-filled frame
 * offset diagonally behind it — a "photo on a colored card" accent for
 * image + text sections. The frame is decorative (`aria-hidden`); the offset
 * grows from `md` screens on.
 */
const meta = {
  title: "forth-ui/Data Display/GradientFrame",
  component: GradientFrame,
  argTypes: {
    children: { control: false },
  },
  args: {
    children: <Photo photo="dusk" />,
    className: { root: "w-80" },
  },
  decorators: [
    (Story) => (
      <div className="p-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GradientFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Tinted with the theme's `primary`, sticking out on the right.
 */
export const Default: Story = {};

/**
 * `side="left"` — the frame sticks out on the left.
 */
export const Left: Story = {
  args: {
    side: "left",
    children: <Photo photo="morning" />,
  },
};

/**
 * Custom gradient stops through `className.frame` (the direction is already
 * set) — e.g. a brand gradient.
 */
export const CustomGradient: Story = {
  args: {
    className: { root: "w-80", frame: "from-lime-500 via-teal-500 to-sky-400" },
  },
};

const SECTIONS = [
  {
    photo: "dusk",
    title: "Evening concerts",
    text: "Every season ends with an open-air concert. Bring a blanket — the program is announced a month ahead.",
  },
  {
    photo: "morning",
    title: "Weekly rehearsals",
    text: "We rehearse every Tuesday. Newcomers are welcome, no audition needed: come and listen first.",
  },
] as const;

/**
 * The typical use: image + text sections where the photo alternates sides,
 * and `side` follows it so the frame always sticks out towards the page edge.
 */
export const AlternatingSections: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-12">
      {SECTIONS.map(({ photo, title, text }, index) => {
        const photoOnRight = index % 2 === 1;
        return (
          <section
            key={title}
            className="grid items-center gap-10 md:grid-cols-2"
          >
            <GradientFrame
              side={photoOnRight ? "right" : "left"}
              className={photoOnRight ? { root: "md:order-last" } : undefined}
            >
              <Photo photo={photo} />
            </GradientFrame>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="text-muted-foreground">{text}</p>
            </div>
          </section>
        );
      })}
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeImage } from "@forthtilliath/forth-ui/components/theme-image";

const svg = (background: string, label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="60"><rect width="180" height="60" rx="8" fill="${background}"/><text x="90" y="37" font-family="sans-serif" font-size="18" text-anchor="middle" fill="${background === "#ffffff" ? "#171717" : "#ffffff"}">${label}</text></svg>`,
  )}`;

/**
 * An image with a light and a dark version, switched by Tailwind's `dark`
 * variant — toggle Storybook's theme to see the other one. Pass `as={Image}`
 * to render Next.js' `Image` instead of an `<img>`.
 */
const meta = {
  title: "forth-ui/Data Display/ThemeImage",
  component: ThemeImage,
  args: {
    srcLight: svg("#ffffff", "Light logo"),
    srcDark: svg("#171717", "Dark logo"),
    alt: "Logo",
    width: 180,
    height: 60,
    className: "rounded-lg border",
  },
} satisfies Meta<typeof ThemeImage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ModeToggle,
  ThemeProvider,
} from "@forthtilliath/forth-ui/components/mode-toggle";

/**
 * A light / dark / system theme switcher built on `next-themes` — render it
 * under `ThemeProvider` (same entry point). Picking a theme here also
 * switches Storybook's own light/dark mode.
 */
const meta = {
  title: "forth-ui/Buttons & Actions/ModeToggle",
  component: ModeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        storageKey="forth-ui-mode-toggle-story"
      >
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ModeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Click the button to pick light, dark or system.
 */
export const Default: Story = {};

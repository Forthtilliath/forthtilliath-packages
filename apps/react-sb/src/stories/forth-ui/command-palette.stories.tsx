import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CalculatorIcon,
  CalendarIcon,
  SettingsIcon,
  SmileIcon,
} from "lucide-react";

import { CommandPalette } from "@forthtilliath/forth-ui/components/command-palette";

/**
 * A global command menu (`Cmd/Ctrl+K` to open) — wraps shadcn-ui's own
 * `CommandDialog` with keyboard-shortcut wiring plus a flat
 * `groups`/`items` API.
 */
const meta = {
  title: "forth-ui/CommandPalette",
  component: CommandPalette,
  args: {
    groups: [
      {
        heading: "Suggestions",
        items: [
          {
            label: "Calendar",
            value: "calendar",
            icon: <CalendarIcon />,
            onSelect: () => undefined,
          },
          {
            label: "Emoji Search",
            value: "emoji",
            icon: <SmileIcon />,
            onSelect: () => undefined,
          },
          {
            label: "Calculator",
            value: "calculator",
            icon: <CalculatorIcon />,
            onSelect: () => undefined,
          },
        ],
      },
      {
        heading: "Settings",
        items: [
          {
            label: "Settings",
            value: "settings",
            icon: <SettingsIcon />,
            shortcut: "⌘S",
            onSelect: () => undefined,
          },
        ],
      },
    ],
    open: true,
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Rendered open by default for the story — in an app it's toggled via
 * `Cmd/Ctrl+K` or a trigger button.
 */
export const Default: Story = {};

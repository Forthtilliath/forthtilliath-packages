import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyIcon, PencilIcon, TrashIcon } from "lucide-react";

import { Button } from "@forthtilliath/forth-ui/components/button";
import { Dropdrawer } from "@forthtilliath/forth-ui/components/dropdrawer";

/**
 * A menu that renders as a `DropdownMenu` on desktop and a bottom `Drawer`
 * on mobile — same items, the interaction pattern each platform's users
 * expect. Resize the viewport (or use Storybook's viewport toolbar) to see
 * it switch.
 */
const meta = {
  title: "forth-ui/Overlays/Dropdrawer",
  component: Dropdrawer,
  args: {
    trigger: <Button variant="outline">Actions</Button>,
    title: "Actions",
    items: [
      { label: "Edit", icon: <PencilIcon />, onSelect: () => undefined },
      { label: "Duplicate", icon: <CopyIcon />, onSelect: () => undefined },
      {
        label: "Delete",
        icon: <TrashIcon />,
        variant: "destructive",
        onSelect: () => undefined,
      },
    ],
  },
} satisfies Meta<typeof Dropdrawer>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form.
 */
export const Default: Story = {};

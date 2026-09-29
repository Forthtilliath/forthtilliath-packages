import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@forthtilliath/forth-ui/components/button";
import { CopyMenuItem } from "@forthtilliath/forth-ui/components/copy-menu-item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@forthtilliath/shadcn-ui/components/dropdown-menu";

/**
 * A `DropdownMenuItem` that copies `value` to the clipboard and shows a
 * checkmark for a couple of seconds — the menu stays open meanwhile.
 */
const meta = {
  title: "forth-ui/Overlays/CopyMenuItem",
  component: CopyMenuItem,
  args: {
    value: "pay_3Nf8a2Lk",
    children: "Copy payment ID",
  },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <CopyMenuItem {...args} />
        <DropdownMenuItem>View payment details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<typeof CopyMenuItem>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Open the menu, then select "Copy payment ID".
 */
export const Default: Story = {};

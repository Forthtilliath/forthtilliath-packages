import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Reparent } from "@forthtilliath/forth-ui/components/reparent";
import { Input } from "@forthtilliath/shadcn-ui/components/input";

/**
 * Moves `children` between different container elements at different
 * screen sizes, without unmounting it — resize the window to see the
 * search box jump between the two boxes below.
 */
const meta = {
  title: "forth-ui/Reparent",
  component: Reparent,
  args: {
    targets: [],
    children: null,
  },
} satisfies Meta<typeof Reparent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    function ReparentDemo() {
      const mobileSlotRef = useRef<HTMLDivElement>(null);
      const desktopSlotRef = useRef<HTMLDivElement>(null);

      return (
        <div className="flex flex-col gap-4">
          <div
            ref={desktopSlotRef}
            className="border-border rounded-lg border p-4"
          >
            <p className="text-muted-foreground mb-2 text-xs">
              Desktop slot (&ge; 640px)
            </p>
          </div>
          <div
            ref={mobileSlotRef}
            className="border-border rounded-lg border p-4"
          >
            <p className="text-muted-foreground mb-2 text-xs">
              Mobile slot (&lt; 640px, fallback)
            </p>
          </div>
          <Reparent
            targets={[
              { query: "(min-width: 640px)", container: desktopSlotRef },
              { container: mobileSlotRef },
            ]}
          >
            <Input placeholder="Search..." className="max-w-xs" />
          </Reparent>
        </div>
      );
    }
    return <ReparentDemo />;
  },
};

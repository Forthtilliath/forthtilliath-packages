import type { Meta, StoryObj } from "@storybook/react-vite";
import { CpuIcon, HardDriveIcon, ZapIcon } from "lucide-react";

import { RadioCard } from "@forthtilliath/forth-ui/components/radio";
import { RadioGroup } from "@forthtilliath/shadcn-ui/components/radio-group";

/**
 * A card-style `RadioGroup` item — the whole card is the clickable target.
 * Use in place of shadcn-ui's `RadioGroupItem` inside the same
 * `RadioGroup`.
 */
const meta = {
  title: "forth-ui/Forms/RadioCard",
  component: RadioCard,
  args: {
    value: "standard",
    label: "Standard",
  },
  render: (args) => (
    <RadioGroup defaultValue="standard" className="grid w-96 grid-cols-1 gap-3">
      <RadioCard
        {...args}
        value="standard"
        label="Standard"
        description="For everyday use."
        icon={<HardDriveIcon className="text-muted-foreground size-5" />}
      />
      <RadioCard
        value="performance"
        label="Performance"
        description="Faster, higher throughput."
        icon={<ZapIcon className="text-muted-foreground size-5" />}
      />
      <RadioCard
        value="compute"
        label="Compute-optimized"
        description="For CPU-bound workloads."
        icon={<CpuIcon className="text-muted-foreground size-5" />}
      />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Click a card to select it.
 */
export const Default: Story = {};

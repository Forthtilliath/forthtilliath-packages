import type { Meta, StoryObj } from "@storybook/react-vite";
import { StarIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@forthtilliath/forth-ui/components/collapsible";

/**
 * An interactive component which expands/collapses a single panel — the
 * single-item primitive `Accordion` is built on top of.
 */
const meta = {
  title: "forth-ui/Layout/Collapsible",
  component: Collapsible,
  args: {
    className: "w-80",
  },
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
      <CollapsibleContent className="text-muted-foreground pt-2">
        Extra settings revealed when expanded — the height transition comes from
        `tw-animate-css`&apos;s `collapsible-down`/`-up` keyframes.
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form, closed by default.
 */
export const Default: Story = {};

/**
 * Use `defaultOpen` to start expanded.
 */
export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
};

/**
 * Use `hideChevron` to remove the icon, or `customChevron` to render a
 * different one (still rotates 180° on open).
 */
export const CustomChevron: Story = {
  render: (args) => (
    <Collapsible {...args}>
      <CollapsibleTrigger customChevron={<StarIcon />}>
        Favorites
      </CollapsibleTrigger>
      <CollapsibleContent className="text-muted-foreground pt-2">
        Starred items appear here.
      </CollapsibleContent>
    </Collapsible>
  ),
};

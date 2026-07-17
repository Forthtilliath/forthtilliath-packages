import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  BentoGrid,
  BentoGridItem,
} from "@forthtilliath/forth-ui/components/bento-grid";

/**
 * A CSS-grid layout for unevenly-sized cards ("bento box" layouts).
 */
const meta = {
  title: "forth-ui/Layout/BentoGrid",
  component: BentoGrid,
} satisfies Meta<typeof BentoGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Mix `colSpan`/`rowSpan` on `BentoGridItem` for an uneven layout.
 */
export const Default: Story = {
  render: () => (
    <BentoGrid className="w-[36rem]">
      <BentoGridItem colSpan={2} rowSpan={2} className="bg-muted/40">
        Featured
      </BentoGridItem>
      <BentoGridItem className="bg-muted/40">Item 2</BentoGridItem>
      <BentoGridItem className="bg-muted/40">Item 3</BentoGridItem>
      <BentoGridItem colSpan={3} className="bg-muted/40">
        Wide item
      </BentoGridItem>
    </BentoGrid>
  ),
};

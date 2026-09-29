import type { Meta, StoryObj } from "@storybook/react-vite";
import { Contrast, HelpCircle, Palette, Zap } from "lucide-react";

import { Accordion } from "@forthtilliath/forth-ui/components/accordion";

import {
  baseItems,
  itemsWith,
  plusChevron,
  plusChevronTrigger,
} from "../accordion-fixtures";

import { accordionArgTypes } from "./accordion.args";

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 */
const meta = {
  title: "forth-ui/Layout/Accordion",
  component: Accordion,
  argTypes: accordionArgTypes,
  args: {
    items: baseItems,
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default accordion story with default styles.
 *
 * Notes:
 * - The accordion is not collapsible by default.
 * - Only one item can be open at a time.
 * - Each item must have a title and a content.
 */
export const Default: Story = {};

/**
 * Use the `outline` variant to create an outline styled accordion.
 * This variant displays a minimal outline style for the accordion items.
 */
export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

/**
 * Use the `box` variant to create a box styled accordion.
 * This style wraps items in a box-like appearance.
 */
export const Box: Story = {
  args: {
    variant: "box",
  },
};

/**
 * Use the `contained` variant for a filled style accordion.
 */
export const Contained: Story = {
  args: {
    variant: "contained",
  },
};

/**
 * Use the `box-contained` variant for a boxed and filled style.
 */
export const BoxContained: Story = {
  args: {
    variant: "box-contained",
  },
};

/**
 * Use the `tabs` variant for a tabbed style accordion.
 */
export const Tabs: Story = {
  args: {
    variant: "tabs",
    defaultValue: "item-0",
  },
};

/**
 * Use the `highlight-active` variant to highlight the active item.
 */
export const HighlightActive: Story = {
  args: {
    variant: "highlight-active",
    defaultValue: "item-0",
  },
};

/**
 * Accordion with items that include distinct icons.
 */
export const Icon: Story = {
  args: {
    defaultValue: "item-0",
    items: itemsWith([
      { icon: <Contrast /> },
      { icon: <Palette /> },
      { icon: <Zap /> },
    ]),
  },
};

/**
 * Accordion with disabled items to demonstrate disabled state.
 */
export const Disabled: Story = {
  args: {
    defaultValue: "item-0",
    items: itemsWith([
      { icon: <Contrast color="green" /> },
      { icon: <Palette color="red" />, disabled: true },
      { icon: <Zap color="green" /> },
    ]),
  },
};

/**
 * Small size variant of the accordion.
 */
export const Sizes: Story = {
  args: {
    variant: "outline",
    size: "sm",
  },
};

/**
 * Large size variant of the accordion.
 */
export const LargeSize: Story = {
  args: {
    variant: "outline",
    size: "lg",
  },
};

/**
 * Use the `collapsible` prop to allow all items to close when clicked.
 */
export const Collapsible: Story = {
  args: {
    collapsible: true,
  },
};

/**
 * Enable opening multiple items simultaneously with `multiple` set to `true`.
 * The `defaultValue` prop must be an array of strings that match the value of the items.
 */
export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ["item-0", "item-2"],
  },
};

/**
 * Hide the chevron icons in the accordion items.
 */
export const NoChevron: Story = {
  args: {
    hideChevron: true,
  },
};

/**
 * Example of an FAQ accordion with an icon indicating help used for all items.
 */
export const FAQExample: Story = {
  args: {
    icon: <HelpCircle className="h-4 w-4" />,
  },
};

/**
 * Accordion items include subtitles to offer more detailed context.
 */
export const Subtitle: Story = {
  args: {
    defaultValue: "item-0",
    items: itemsWith([
      {
        subtitle: "Find out more about our accessibility features.",
        icon: <Contrast color="green" />,
      },
      {
        subtitle: "Explore the aesthetic uniformity",
        icon: <Palette color="purple" />,
      },
      {
        subtitle: "Animation customization options",
        icon: <Zap color="blue" />,
      },
    ]),
  },
};

/**
 * This story demonstrates deep customization of styles for the accordion component.
 */
export const Stylizable: Story = {
  args: {
    collapsible: true,
    variant: "box-contained",
    defaultValue: "item-0",
    classNameTrigger:
      "[&_[data-slot=title]]:no-underline [&_[data-slot=icon]]:group-hover:rotate-45 [&_[data-slot=icon]]:transition [&_[data-slot=icon]]:duration-100",
    classNameItem: "bg-purple-300/50",
    classNameContent: "ps-7",
    items: itemsWith([
      { icon: <Contrast size={16} /> },
      { icon: <Palette size={16} /> },
      { icon: <Zap size={16} /> },
    ]),
  },
};

/**
 * The right chevron icon can be customized using the `customChevron` prop.
 * Note that you can still style the chevron icon using the `classNameTrigger` prop if needed.
 */
export const CustomChevron: Story = {
  args: {
    customChevron: plusChevron,
    classNameTrigger: plusChevronTrigger,
  },
};

/**
 * You can also pass a custom chevron icon and position it to the left using `chevronAlignment="left"`.
 */
export const LeftCustomChevron: Story = {
  args: {
    chevronAlignment: "left",
    customChevron: plusChevron,
    classNameTrigger: plusChevronTrigger,
  },
};

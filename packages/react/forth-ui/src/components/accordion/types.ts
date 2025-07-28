import type React from "react";
import {
  type AccordionMultipleProps,
  type AccordionSingleProps,
} from "@radix-ui/react-accordion";
import type { VariantProps } from "class-variance-authority";
import type { LucideProps } from "lucide-react";

import { accordionTriggerVariants } from "./variants";

type AccordionVariantType =
  | "default"
  | "outline"
  | "box"
  | "contained"
  | "box-contained"
  | "tabs"
  | "highlight-active";

type AccordionSizeType = "sm" | "default" | "lg";

interface Item {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface ItemWithIcon extends Item {
  icon: React.ReactNode;
}

interface BaseProps {
  /**
   * The items to render in the accordion.
   */
  items: Item[] | ItemWithIcon[];
  /**
   * The icon displayed next to the title is the same for all items.
   * 
   * Additionally, using both ItemWithIcon and icon will throw an error.
   */
  icon?: React.ReactNode;
  /**
   * Hide the chevron icon.
   * @default false
   */
  hideChevron?: boolean;
  /**
   * The alignment of the chevron icon.
   * @default "right"
   */
  chevronAlignment?: VariantProps<
    typeof accordionTriggerVariants
  >["chevronAlignment"];
  /**
   * Custom chevron icon.
   */
  customChevron?: React.ReactElement<LucideProps>;
  /**
   * Style the accordion.
   */
  className?: string;
  /**
   * Style the accordion item.
   */
  classNameItem?: string;
  /**
   * Style the accordion trigger.
   */
  classNameTrigger?: string;
  /**
   * Style the accordion content.
   */
  classNameContent?: string;
  /**
   * The variant of the accordion.
   * @default "default"
   */
  variant?: AccordionVariantType;
  /**
   * The size of the accordion.
   * @default "default"
   */
  size?: AccordionSizeType;
  /**
   * Generate a unique id for each item.
   * @default `item-{index}`
   */
  generateId?: (index: number) => string;
}

// Props removed from Primitive props
type OmittedProps = "type" | "defaultValue" | "collapsible";
export type SingleProps = BaseProps &
  Omit<AccordionSingleProps, OmittedProps> & {
    /**
     * Set the ``type`` prop to ``multiple`` to enable opening multiple items at once.
     * @default false
     */
    multiple?: false;
    /** Set the default open item */
    defaultValue?: string;
    /**
     * Use the ``collapsible`` prop to allow all items to close.
     * @default false
     */
    collapsible?: boolean;
  };
export type MultipleProps = BaseProps &
  Omit<AccordionMultipleProps, OmittedProps> & {
    multiple: true;
    /** Set the default open items */
    defaultValue?: string[];
    /**
     * Use the ``collapsible`` prop to allow all items to close.
     * @default true
     */
    collapsible?: true;
  };

export type AccordionProps = SingleProps | MultipleProps;

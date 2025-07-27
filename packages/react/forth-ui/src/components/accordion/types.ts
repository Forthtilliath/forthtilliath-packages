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
  items: Item[] | ItemWithIcon[];
  icon?: React.ReactNode;
  multiple?: boolean;
  hideChevron?: boolean;
  chevronAlignment?: VariantProps<
    typeof accordionTriggerVariants
  >["chevronAlignment"];
  customChevron?: React.ReactElement<LucideProps>;
  className?: string;
  classNameItem?: string;
  classNameTrigger?: string;
  classNameContent?: string;
  variant?: AccordionVariantType;
  size?: AccordionSizeType;
  generateId?: (index: number) => string;
}

// Props removed from Primitive props
type OmittedProps = "type";
export type SingleProps = BaseProps & Omit<AccordionSingleProps, OmittedProps>;
export type MultipleProps = BaseProps &
  Omit<AccordionMultipleProps, OmittedProps>;

export type AccordionProps = SingleProps | MultipleProps;

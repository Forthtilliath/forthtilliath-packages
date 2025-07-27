import React from "react";
import {
  type AccordionMultipleProps,
  type AccordionSingleProps,
} from "@radix-ui/react-accordion";
import { cva } from "class-variance-authority";

import {
  Accordion as AccordionPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@forthtilliath/shadcn-ui/components/accordion";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

type AccordionVariantType =
  | "default"
  | "outline"
  | "box"
  | "contained"
  | "box-contained"
  | "tabs"
  | "highlight-active";

type AccordionSizeType = "sm" | "default" | "lg";

const accordionRootVariants = cva("max-w-lg my-4 w-full", {
  variants: {
    variant: {
      default: "space-y-2",
      outline: "space-y-2",
      box: "",
      contained: "space-y-2",
      "box-contained": "",
      tabs: "space-y-2",
      "highlight-active": "space-y-2",
    },
    size: {
      sm: "text-sm",
      default: "text-[15px]",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      outline: "border rounded-md last:border-b",
      box: "border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md",
      contained: "border-none rounded-md bg-secondary",
      "box-contained":
        "last:border-none first:rounded-t-md last:rounded-b-md bg-muted",
      tabs: "border-none rounded-md data-[state=open]:bg-secondary",
      "highlight-active":
        "data-[state=open]:border-b-2 data-[state=open]:border-indigo-600 dark:data-[state=open]:border-indigo-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const accordionTriggerVariants = cva("", {
  variants: {
    variant: {
      default: "",
      outline: "",
      box: "",
      contained: "",
      "box-contained": "",
      tabs: "data-[state=closed]:py-2",
      "highlight-active":
        "data-[state=open]:text-indigo-600 dark:data-[state=open]:text-indigo-500",
    },
    size: {
      sm: "py-3 px-4 text-sm",
      default: "py-4 px-6 text-[15px]",
      lg: "py-5 px-6 text-lg",
    },
    disabled: {
      false: "",
      true: "opacity-50",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    disabled: false,
  },
});

const accordionContentVariants = cva("", {
  variants: {
    variant: {
      default: "",
      outline: "",
      box: "",
      contained: "",
      "box-contained": "",
      tabs: "",
      "highlight-active": "",
    },
    size: {
      sm: "px-4 pb-3 text-sm",
      default: "px-6 pb-4 text-[15px]",
      lg: "px-6 pb-5 text-lg",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

interface Item {
  title: React.ReactNode;
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
type SingleProps = BaseProps & Omit<AccordionSingleProps, OmittedProps>;
type MultipleProps = BaseProps & Omit<AccordionMultipleProps, OmittedProps>;

type Props = SingleProps | MultipleProps;

/**
 * A vertically stacked set of interactive headings that each reveal a section of content.
 *
 * @description Inspired from multiple sources, to make a consistent and reusable component.
 * @version 0.0.1
 * @author Forth
 *
 * @see https://ui.shadcn.com/docs/components/accordion
 * @see https://motion-primitives.com/docs/accordion
 * @see https://originui.com/accordion
 * @see https://www.hextaui.com/docs/ui/components/accordion
 * @see https://www.shadcnui-blocks.com/components/accordion
 */
export function Accordion({ multiple, ...props }: Props) {
  if (props.icon && props.items.some((item) => "icon" in item && item.icon)) {
    throw new Error("You can't use both icon and items.icon");
  }

  return multiple ? (
    <AccordionMultiple {...(props as MultipleProps)} />
  ) : (
    <AccordionSingle {...(props as SingleProps)} />
  );
}

function AccordionSingle({
  className,
  variant,
  size,
  hideChevron,
  items,
  icon,
  classNameItem,
  classNameTrigger,
  classNameContent,
  generateId,
  ...props
}: SingleProps) {
  return (
    <AccordionPrimitive
      type="single"
      className={cn(accordionRootVariants({ variant, size }), className)}
      {...props}
    >
      <Items
        variant={variant}
        size={size}
        hideChevron={hideChevron}
        items={items}
        icon={icon}
        classNameItem={classNameItem}
        classNameTrigger={classNameTrigger}
        classNameContent={classNameContent}
        generateId={generateId}
      />
    </AccordionPrimitive>
  );
}

function AccordionMultiple({
  className,
  variant,
  size,
  hideChevron,
  items,
  icon,
  classNameItem,
  classNameTrigger,
  classNameContent,
  generateId,
  ...props
}: MultipleProps) {
  return (
    <AccordionPrimitive
      type="multiple"
      className={cn(accordionRootVariants({ variant, size }), className)}
      {...props}
    >
      <Items
        variant={variant}
        size={size}
        hideChevron={hideChevron}
        items={items}
        icon={icon}
        classNameItem={classNameItem}
        classNameTrigger={classNameTrigger}
        classNameContent={classNameContent}
        generateId={generateId}
      />
    </AccordionPrimitive>
  );
}

function Items({
  hideChevron,
  items,
  icon,
  classNameItem,
  classNameTrigger,
  classNameContent,
  variant,
  size,
  generateId = (index) => `item-${String(index)}`,
}: Omit<Props, "multiple" | "className">) {
  return items.map(({ title, content, disabled, ...props }, index) => {
    let iconItem = icon;
    if ("icon" in props) iconItem = props.icon;

    return (
      <AccordionItem
        key={index}
        value={generateId(index)}
        className={cn(accordionItemVariants({ variant }), classNameItem)}
      >
        <AccordionTrigger
          disabled={disabled}
          hideChevron={hideChevron}
          className={cn(
            accordionTriggerVariants({ variant, size, disabled }),
            classNameTrigger
          )}
        >
          {iconItem ? (
            <div className="flex items-center gap-3">
              <span className="shrink-0">{iconItem}</span>
              {title}
            </div>
          ) : (
            title
          )}
        </AccordionTrigger>
        <AccordionContent
          className={cn(
            accordionContentVariants({ variant, size }),
            classNameContent
          )}
        >
          {content}
        </AccordionContent>
      </AccordionItem>
    );
  });
}

import React from "react";
import {
  type AccordionMultipleProps,
  type AccordionSingleProps,
} from "@radix-ui/react-accordion";
import { cva, VariantProps } from "class-variance-authority";
import { LucideProps } from "lucide-react";

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
      outline: "px-4 border rounded-md last:border-b",
      box: "px-4 border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md",
      contained: "px-4 border-none rounded-md bg-secondary",
      "box-contained":
        "px-4 last:border-none first:rounded-t-md last:rounded-b-md bg-muted",
      tabs: "px-4 border-none rounded-md data-[state=open]:bg-secondary",
      "highlight-active":
        "px-4 data-[state=open]:border-b-2 data-[state=open]:border-indigo-600 dark:data-[state=open]:border-indigo-500",
    },
    size: {
      sm: "px-2",
      default: "",
      lg: "px-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const accordionTriggerVariants = cva("hover:no-underline group items-center", {
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
      sm: "py-3 text-sm [&_[data-slot=subtitle]]:text-xs",
      default: "py-4 text-[15px] [&_[data-slot=subtitle]]:text-sm",
      lg: "py-5 text-lg [&_[data-slot=subtitle]]:text-base",
    },
    disabled: {
      false: "",
      true: "opacity-50",
    },
    chevronAlignment: {
      right: "",
      left: "flex-row-reverse",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    disabled: false,
    chevronAlignment: "right",
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
      sm: "pb-3 text-sm",
      default: "pb-4 text-[15px]",
      lg: "pb-5 text-lg",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

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
  chevronAlignment,
  customChevron,
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
        chevronAlignment={chevronAlignment}
        customChevron={customChevron}
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
  chevronAlignment,
  customChevron,
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
        chevronAlignment={chevronAlignment}
        customChevron={customChevron}
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
  chevronAlignment,
  customChevron,
  items,
  icon,
  classNameItem,
  classNameTrigger,
  classNameContent,
  variant,
  size,
  generateId = (index) => `item-${String(index)}`,
}: Omit<Props, "multiple" | "className">) {
  return items.map(
    ({ title, subtitle, content, disabled, ...props }, index) => {
      let iconItem = icon;
      if ("icon" in props) iconItem = props.icon;

      const triggerItem = (
        <div className="flex-1 flex flex-col text-start">
          <span
            data-slot="title"
            className="group-hover:underline [&_svg]:-order-1"
          >
            {title}
          </span>
          {subtitle && (
            <span
              data-slot="subtitle"
              className="text-muted-foreground font-normal"
            >
              {subtitle}
            </span>
          )}
        </div>
      );

      return (
        <AccordionItem
          key={index}
          value={generateId(index)}
          className={cn(
            accordionItemVariants({ variant, size }),
            classNameItem
          )}
        >
          <AccordionTrigger
            disabled={disabled}
            hideChevron={hideChevron}
            customChevron={customChevron}
            className={cn(
              accordionTriggerVariants({
                variant,
                size,
                disabled,
                chevronAlignment,
              }),
              classNameTrigger
            )}
          >
            {iconItem ? (
              <div className="flex items-center gap-3">
                <span data-slot="icon" className="shrink-0">
                  {iconItem}
                </span>
                {triggerItem}
              </div>
            ) : (
              triggerItem
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
    }
  );
}

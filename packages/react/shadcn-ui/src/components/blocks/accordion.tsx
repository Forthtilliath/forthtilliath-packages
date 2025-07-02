import type React from "react";
import {
  type AccordionMultipleProps,
  type AccordionSingleProps,
} from "@radix-ui/react-accordion";
import { cva } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import {
  Accordion as AccordionPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@forthtilliath/shadcn-ui/components/accordion";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

// https://www.shadcnui-blocks.com/components/accordion

type AccordionVariantType =
  | "default"
  | "outline"
  | "box"
  | "contained"
  | "box-contained"
  | "tabs"
  | "highlight-active";

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
  },
  defaultVariants: { variant: "default" },
});

const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      outline: "border rounded-md px-4 last:border-b",
      box: "border border-b-0 last:border-b first:rounded-t-md last:rounded-b-md px-4",
      contained: "border-none rounded-md px-4 bg-secondary",
      "box-contained":
        "last:border-none first:rounded-t-md last:rounded-b-md px-4 bg-muted",
      tabs: "border-none rounded-md px-4 data-[state=open]:bg-secondary",
      "highlight-active":
        "data-[state=open]:border-b-2 data-[state=open]:border-indigo-600 dark:data-[state=open]:border-indigo-500",
    },
  },
  defaultVariants: { variant: "default" },
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
    disabled: {
      false: "",
      true: "opacity-50",
    },
  },
  defaultVariants: { variant: "default", disabled: false },
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
  },
  defaultVariants: { variant: "default" },
});

interface Item {
  title: React.ReactNode;
  content: React.ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface BaseProps {
  items: Item[];
  multiple?: boolean;
  className?: string;
  classNameItem?: string;
  classNameTrigger?: string;
  classNameContent?: string;
  variant?: AccordionVariantType;
  generateId?: (index: number) => string;
}

// Props removed from Primitive props
type OmittedProps = "type";
type SingleProps = BaseProps & Omit<AccordionSingleProps, OmittedProps>;
type MultipleProps = BaseProps & Omit<AccordionMultipleProps, OmittedProps>;

type Props = SingleProps | MultipleProps;

export function Accordion({ multiple, ...props }: Props) {
  return multiple ? (
    <AccordionMultiple {...(props as MultipleProps)} />
  ) : (
    <AccordionSingle {...(props as SingleProps)} />
  );
}

function AccordionSingle({
  className,
  variant,
  items,
  classNameItem,
  classNameTrigger,
  classNameContent,
  generateId,
  ...props
}: SingleProps) {
  return (
    <AccordionPrimitive
      type="single"
      className={cn(accordionRootVariants({ variant }), className)}
      {...props}
    >
      <Items
        variant={variant}
        items={items}
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
  items,
  classNameItem,
  classNameTrigger,
  classNameContent,
  generateId,
  ...props
}: MultipleProps) {
  return (
    <AccordionPrimitive
      type="multiple"
      className={cn(accordionRootVariants({ variant }), className)}
      {...props}
    >
      <Items
        variant={variant}
        items={items}
        classNameItem={classNameItem}
        classNameTrigger={classNameTrigger}
        classNameContent={classNameContent}
        generateId={generateId}
      />
    </AccordionPrimitive>
  );
}

function Items({
  items,
  classNameItem,
  classNameTrigger,
  classNameContent,
  variant,
  generateId = (index) => `item-${String(index)}`,
}: Omit<Props, "multiple" | "className">) {
  return items.map(({ title, content, icon: Icon, disabled }, index) => (
    <AccordionItem
      key={index}
      value={generateId(index)}
      className={cn(accordionItemVariants({ variant }), classNameItem)}
    >
      <AccordionTrigger
        disabled={disabled}
        className={cn(
          accordionTriggerVariants({ variant, disabled }),
          classNameTrigger
        )}
      >
        {Icon ? (
          <div className="flex items-start gap-3">
            <Icon />
            {title}
          </div>
        ) : (
          title
        )}
      </AccordionTrigger>
      <AccordionContent
        className={cn(accordionContentVariants({ variant }), classNameContent)}
      >
        {content}
      </AccordionContent>
    </AccordionItem>
  ));
}

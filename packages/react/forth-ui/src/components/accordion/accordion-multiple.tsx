import { Accordion as AccordionPrimitive } from "@forthtilliath/shadcn-ui/components/accordion";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { Items } from "./accordion-items";
import type { MultipleProps } from "./types";
import { accordionRootVariants } from "./variants";

export function AccordionMultiple({
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

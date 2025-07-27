import { Accordion as AccordionPrimitive } from "@forthtilliath/shadcn-ui/components/accordion";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import { Items } from "./accordion-items";
import type { SingleProps } from "./types";
import { accordionRootVariants } from "./variants";

export function AccordionSingle({
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

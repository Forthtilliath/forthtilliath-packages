import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@forthtilliath/shadcn-ui/components/accordion";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import type { AccordionProps } from "./types";
import {
  accordionContentVariants,
  accordionItemVariants,
  accordionTriggerVariants,
} from "./variants";

export function Items({
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
}: Omit<AccordionProps, "multiple" | "className">) {
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

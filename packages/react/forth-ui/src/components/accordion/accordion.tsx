import { AccordionMultiple } from "./accordion-multiple";
import { AccordionSingle } from "./accordion-single";
import type { AccordionProps, MultipleProps, SingleProps } from "./types";

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
export function Accordion({ multiple, ...props }: AccordionProps) {
  if (props.icon && props.items.some((item) => "icon" in item && item.icon)) {
    throw new Error("You can't use both icon and items.icon");
  }

  return multiple ? (
    <AccordionMultiple {...(props as MultipleProps)} />
  ) : (
    <AccordionSingle {...(props as SingleProps)} />
  );
}

import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

import {
  gridItemDebugVariants,
  type GridItemVariants,
  gridItemVariants,
} from "./variants";

type Props = React.ComponentProps<"div"> & {
  children: React.ReactNode;
  debug?: boolean;
  isDebugActive?: boolean;
} & GridItemVariants;

export function GridItem({
  children,
  className,
  debug,
  isDebugActive,
  ...props
}: Props) {
  console.log({ debug, isDebugActive });
  return (
    <div
      className={cn(gridItemVariants({ debug }), className)}
      data-slot="grid-item"
      {...props}
    >
      {children}

      {debug && (
        <div
          className={cn(gridItemDebugVariants({ active: isDebugActive }))}
          data-slot="grid-item-debug"
        />
      )}
    </div>
  );
}

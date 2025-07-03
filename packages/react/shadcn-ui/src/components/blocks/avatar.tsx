import { cva, type VariantProps } from "class-variance-authority";

import {
  Avatar as AvatarPrimitive,
  AvatarFallback,
  AvatarImage,
} from "@forthtilliath/shadcn-ui/components/avatar";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

const avatarVariants = cva("", {
  variants: {
    rounded: {
      full: "rounded-full",
      lg: "rounded-lg",
      md: "rounded-md",
      none: "rounded-none",
    },
    size: {
      8: "size-8",
      10: "size-10",
      12: "size-12",
      14: "size-14",
      16: "size-16",
      20: "size-20",
      24: "size-24",
    },
    ring: {
      false: "",
      true: "ring-2 ring-green-500 ring-offset-[3px] ring-offset-background",
    },
  },
  defaultVariants: { rounded: "full", ring: false },
});

interface Props
  extends React.ComponentProps<typeof AvatarPrimitive>,
    VariantProps<typeof avatarVariants> {
  src: string;
  alt: string;
  fallback: string;
  classNameImage?: string;
  classNameFallback?: string;
}

export function Avatar({
  src,
  alt,
  fallback,
  className,
  classNameImage,
  classNameFallback,
  rounded,
  ring,
  size,
  ...props
}: Props) {
  return (
    <AvatarPrimitive
      className={cn(avatarVariants({ rounded, ring, size }), className)}
      {...props}
    >
      <AvatarImage src={src} alt={alt} className={cn(classNameImage)} />
      <AvatarFallback
        className={cn(avatarVariants({ rounded }), classNameFallback)}
      >
        {fallback}
      </AvatarFallback>
    </AvatarPrimitive>
  );
}

import {
  Avatar as AvatarPrimitive,
  AvatarFallback,
  AvatarImage,
} from "@forthtilliath/shadcn-ui/components/avatar";

export type AvatarProps = React.ComponentProps<typeof AvatarPrimitive> & {
  /**
   * The source URL of the image.
   */
  src: string;
  /**
   * The alt text for the image.
   */
  alt: string;
  /**
   * The status of the user.
   */
  status?: boolean;
};
export function Avatar({ src, alt, status, ...props }: AvatarProps) {
  return (
    <div className="relative">
      <AvatarPrimitive {...props}>
        <AvatarImage src={src} />
        <AvatarFallback>{alt}</AvatarFallback>
      </AvatarPrimitive>
      {status !== undefined && (
        <div className="border-background absolute -end-0.5 -top-0.5 size-3 rounded-full border-2 bg-green-500">
          <span className="sr-only">Online</span>
        </div>
      )}
    </div>
  );
}

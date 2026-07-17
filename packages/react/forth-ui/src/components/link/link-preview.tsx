import type * as React from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@forthtilliath/shadcn-ui/components/hover-card";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export interface LinkPreviewMetadata {
  title: React.ReactNode;
  description?: React.ReactNode;
  image?: string;
  favicon?: string;
  url?: string;
}

export interface LinkPreviewProps {
  metadata: LinkPreviewMetadata;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reveals a metadata card (title/description/image) on hover over its
 * trigger — the "unfurl" pattern used for link previews.
 *
 * Metadata is supplied by the caller rather than fetched live: both
 * reference sources (kibo-ui's Glimpse, aceternity's Link Preview) depend
 * on a live external fetch (an Open Graph scrape via an RSC / server
 * action, or a screenshot from the Microlink API respectively) — a
 * network/backend dependency out of scope for a UI-only package. Wire this
 * to your own metadata source (a server action, a cached lookup, etc.) and
 * pass the result in as `metadata`.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://ui.shadcn.com/docs/components/hover-card
 * @see https://www.kibo-ui.com/components/glimpse
 * @see https://ui.aceternity.com/components/link-preview
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function LinkPreview({
  metadata,
  children,
  className,
}: LinkPreviewProps) {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className={cn("w-80 overflow-hidden p-0", className)}>
        {metadata.image !== undefined && (
          <img
            src={metadata.image}
            alt=""
            className="aspect-video w-full object-cover"
          />
        )}
        <div className="space-y-1 p-3">
          <div className="flex items-center gap-1.5">
            {metadata.favicon !== undefined && (
              <img src={metadata.favicon} alt="" className="size-3.5" />
            )}
            {metadata.url !== undefined && (
              <span className="text-muted-foreground truncate text-xs">
                {metadata.url}
              </span>
            )}
          </div>
          <p className="text-sm leading-none font-medium">{metadata.title}</p>
          {metadata.description !== undefined && (
            <p className="text-muted-foreground line-clamp-2 text-xs">
              {metadata.description}
            </p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

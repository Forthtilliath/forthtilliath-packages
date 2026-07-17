"use client";

import type React from "react";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/forth-ui/collapsible";

export interface TreeNode {
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNode[];
}

export interface TreeProps {
  data: TreeNode[];
  defaultExpanded?: boolean;
  className?: string;
}

/**
 * A hierarchical, expandable/collapsible list of nodes (file explorer,
 * nested categories) — built on forth-ui's own `Collapsible` for each
 * branch's expand animation rather than reimplementing it.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://originui.com/tree
 * @see https://www.hextaui.com/docs/ui/components/tree
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Tree({ data, defaultExpanded = false, className }: TreeProps) {
  return (
    <ul data-slot="tree" className={cn("grid gap-0.5 text-sm", className)}>
      {data.map((node, index) => (
        // eslint-disable-next-line @eslint-react/no-array-index-key -- `label` is an arbitrary ReactNode with no guaranteed unique field
        <TreeItem key={index} node={node} defaultExpanded={defaultExpanded} />
      ))}
    </ul>
  );
}

function TreeItem({
  node,
  defaultExpanded,
}: {
  node: TreeNode;
  defaultExpanded: boolean;
}) {
  const hasChildren = node.children !== undefined && node.children.length > 0;

  if (!hasChildren) {
    return (
      <li className="hover:bg-accent flex items-center gap-1.5 rounded-md px-2 py-1 pl-7">
        {node.icon ?? <FileIcon className="text-muted-foreground size-4" />}
        {node.label}
      </li>
    );
  }

  return (
    <li>
      <Collapsible defaultOpen={defaultExpanded}>
        <CollapsibleTrigger
          hideChevron
          className="hover:bg-accent flex w-full items-center gap-1.5 rounded-md px-2 py-1 [&>svg:first-child]:transition-transform [&[data-state=open]>svg:first-child]:rotate-90"
        >
          <ChevronRightIcon className="size-4 shrink-0" />
          {node.icon ?? <FolderIcon className="text-muted-foreground size-4" />}
          {node.label}
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4">
          <ul className="grid gap-0.5">
            {node.children?.map((child, index) => (
              <TreeItem
                // eslint-disable-next-line @eslint-react/no-array-index-key -- see above
                key={index}
                node={child}
                defaultExpanded={defaultExpanded}
              />
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

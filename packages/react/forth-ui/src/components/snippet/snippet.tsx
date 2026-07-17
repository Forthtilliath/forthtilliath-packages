"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@forthtilliath/shadcn-ui/components/tabs";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export interface SnippetItem {
  value: string;
  label: React.ReactNode;
  code: string;
}

export interface SnippetProps {
  items: SnippetItem[];
  /** @default items[0]?.value */
  defaultValue?: string;
  className?: string;
}

const COPY_FEEDBACK_MS = 2000;

/**
 * Displays and copies code in a tabbed interface — the "npm install /
 * yarn add / pnpm add" pattern.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.kibo-ui.com/components/snippet
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function Snippet({ items, defaultValue, className }: SnippetProps) {
  const [copiedValue, setCopiedValue] = React.useState<string | null>(null);

  function handleCopy(item: SnippetItem) {
    void navigator.clipboard.writeText(item.code).then(() => {
      setCopiedValue(item.value);
      setTimeout(() => {
        setCopiedValue(null);
      }, COPY_FEEDBACK_MS);
    });
  }

  return (
    <Tabs
      defaultValue={defaultValue ?? items[0]?.value}
      className={cn(
        "border-border overflow-hidden rounded-lg border",
        className,
      )}
    >
      <TabsList className="bg-muted/40 h-auto w-full justify-start rounded-none border-b p-0">
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="data-[state=active]:bg-background rounded-none font-mono text-xs"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent
          key={item.value}
          value={item.value}
          className="relative m-0"
        >
          <pre className="overflow-x-auto p-4 pr-12 font-mono text-sm">
            <code>{item.code}</code>
          </pre>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              handleCopy(item);
            }}
            aria-label={copiedValue === item.value ? "Copied" : "Copy"}
            className="absolute top-2 right-2 size-7"
          >
            {copiedValue === item.value ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </TabsContent>
      ))}
    </Tabs>
  );
}

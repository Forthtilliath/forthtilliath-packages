"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@forthtilliath/shadcn-ui/components/command";

import { navItems } from "./nav-items";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function runCommand(url: string) {
    setOpen(false);
    router.push(url);
  }

  return (
    <>
      <Button
        variant="outline"
        className="text-muted-foreground w-full justify-start gap-2 sm:w-48"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="bg-muted pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {navItems.map((item) => (
              <CommandItem
                key={item.url}
                onSelect={() => {
                  runCommand(item.url);
                }}
              >
                <item.icon />
                <span>{item.title}</span>
              </CommandItem>
            ))}
            <CommandItem
              onSelect={() => {
                runCommand("/components");
              }}
            >
              <BookOpen />
              <span>Component reference</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

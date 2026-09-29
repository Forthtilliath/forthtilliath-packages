"use client";

import { useState } from "react";
import { Grid2x2, List, SlidersHorizontal } from "lucide-react";

import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import { Checkbox } from "@forthtilliath/shadcn-ui/components/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@forthtilliath/shadcn-ui/components/drawer";
import { Label } from "@forthtilliath/shadcn-ui/components/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@forthtilliath/shadcn-ui/components/menubar";
import { Skeleton } from "@forthtilliath/shadcn-ui/components/skeleton";
import { Toggle } from "@forthtilliath/shadcn-ui/components/toggle";

export function TicketsCard() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [loading] = useState(true);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Your tickets</CardTitle>
          <CardDescription>2 open, 14 resolved.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Toggle
            pressed={view === "list"}
            onPressedChange={() => {
              setView("list");
            }}
            aria-label="List view"
          >
            <List />
          </Toggle>
          <Toggle
            pressed={view === "grid"}
            onPressedChange={() => {
              setView("grid");
            }}
            aria-label="Grid view"
          >
            <Grid2x2 />
          </Toggle>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter tickets</DrawerTitle>
                <DrawerDescription>
                  Narrow down the list by status.
                </DrawerDescription>
              </DrawerHeader>
              <div className="space-y-3 px-4">
                {["Open", "Pending", "Resolved"].map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-${status}`}
                      defaultChecked={status !== "Resolved"}
                    />
                    <Label htmlFor={`filter-${status}`}>{status}</Label>
                  </div>
                ))}
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Apply filters</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </CardHeader>
      <CardContent>
        <Menubar className="mb-4">
          <MenubarMenu>
            <MenubarTrigger>Status</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Open</MenubarItem>
              <MenubarItem>Pending</MenubarItem>
              <MenubarItem>Resolved</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Priority</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Low</MenubarItem>
              <MenubarItem>Medium</MenubarItem>
              <MenubarItem>High</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Assign to</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Olivia Martin</MenubarItem>
              <MenubarItem>Jackson Lee</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

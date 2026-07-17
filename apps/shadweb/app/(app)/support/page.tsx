"use client";

import { useState } from "react";
import { Grid2x2, List, SlidersHorizontal } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@forthtilliath/shadcn-ui/components/accordion";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@forthtilliath/shadcn-ui/components/carousel";
import { Checkbox } from "@forthtilliath/shadcn-ui/components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@forthtilliath/shadcn-ui/components/collapsible";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@forthtilliath/shadcn-ui/components/input-otp";
import { Label } from "@forthtilliath/shadcn-ui/components/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@forthtilliath/shadcn-ui/components/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@forthtilliath/shadcn-ui/components/navigation-menu";
import { ScrollArea } from "@forthtilliath/shadcn-ui/components/scroll-area";
import { Skeleton } from "@forthtilliath/shadcn-ui/components/skeleton";
import { Textarea } from "@forthtilliath/shadcn-ui/components/textarea";
import { Toggle } from "@forthtilliath/shadcn-ui/components/toggle";
import { toast } from "@forthtilliath/shadcn-ui/lib/sonner";

const faqs = [
  {
    question: "How do I invite teammates?",
    answer: 'Go to Team → "Invite member" and enter their email address.',
  },
  {
    question: "Can I export my invoices?",
    answer: "Yes, from the Billing page — pick a date range and download.",
  },
  {
    question: "How do I change my plan?",
    answer:
      "Billing → Plan. Downgrades ask for confirmation since you lose features immediately at renewal.",
  },
];

const activity = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  text: `Ticket #${String(1042 - i)} updated ${String(i + 1)}h ago`,
}));

export default function SupportPage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [loading] = useState(true);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
          <p className="text-muted-foreground text-sm">
            Browse help topics or reach out to the team directly.
          </p>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Help topics</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-64 gap-2 p-4">
                  <li>
                    <NavigationMenuLink href="#">
                      Getting started
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="#">
                      Billing & plans
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink href="#">
                      API reference
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
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

          <Card>
            <CardHeader>
              <CardTitle>Frequently asked questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact support</CardTitle>
              <CardDescription>
                We usually reply within a few hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="Describe your issue..." rows={4} />
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="link" className="h-auto p-0">
                    Advanced options
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-3">
                  <div className="space-y-2">
                    <Label>Verify phone number</Label>
                    <InputOTP maxLength={4}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="support-notify" defaultChecked />
                    <Label htmlFor="support-notify" className="font-normal">
                      Notify me by email
                    </Label>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Button
                className="w-full"
                onClick={() => {
                  toast("Support ticket submitted");
                }}
              >
                Submit ticket
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticket #1042 screenshots</CardTitle>
              <CardDescription>Attached by the customer.</CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel>
                <CarouselContent>
                  {[1, 2, 3].map((n) => (
                    <CarouselItem key={n}>
                      <div className="bg-muted flex h-32 items-center justify-center rounded-md text-sm font-medium">
                        Screenshot {n}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2 pr-4">
                  {activity.map((item) => (
                    <p key={item.id} className="text-muted-foreground text-sm">
                      {item.text}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@forthtilliath/shadcn-ui/components/navigation-menu";

import { ActivityCard } from "./activity-card";
import { ContactCard } from "./contact-card";
import { FaqCard } from "./faq-card";
import { ScreenshotsCard } from "./screenshots-card";
import { TicketsCard } from "./tickets-card";

export default function SupportPage() {
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
          <TicketsCard />
          <FaqCard />
        </div>

        <div className="space-y-4">
          <ContactCard />
          <ScreenshotsCard />
          <ActivityCard />
        </div>
      </div>
    </>
  );
}

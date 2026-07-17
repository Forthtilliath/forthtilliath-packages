"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@forthtilliath/shadcn-ui/components/breadcrumb";
import { Separator } from "@forthtilliath/shadcn-ui/components/separator";
import { SidebarTrigger } from "@forthtilliath/shadcn-ui/components/sidebar";

import { ModeToggle } from "../mode-toggle";

import { CommandMenu } from "./command-menu";
import { navItems } from "./nav-items";
import { UserNav } from "./user-nav";

export function SiteHeader() {
  const pathname = usePathname();
  const current = navItems.find((item) => item.url === pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              {current?.title ?? "Acme Analytics"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CommandMenu />
      <ModeToggle />
      <UserNav />
    </header>
  );
}

import { Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@forthtilliath/shadcn-ui/components/sidebar";

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

export default function SidebarDemoPage() {
  return (
    <SidebarProvider className="min-h-[calc(100vh-3.5rem)]">
      <Sidebar>
        <SidebarHeader className="p-4 text-sm font-semibold">
          @forthtilliath/shadcn-ui
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-muted-foreground p-4 text-xs">
          v0.1.0
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Sidebar demo</span>
        </header>
        <main className="p-6">
          <p className="text-muted-foreground max-w-lg text-sm">
            This route uses the Sidebar block directly (SidebarProvider +
            Sidebar + SidebarInset), which needs a full-height layout rather
            than the single-page container the rest of the showcase uses —
            that&apos;s why it lives outside the{" "}
            <code className="bg-muted rounded px-1 py-0.5">(showcase)</code>{" "}
            route group.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import {
  SidebarInset,
  SidebarProvider,
} from "@forthtilliath/shadcn-ui/components/sidebar";

import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 space-y-6 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Toaster } from "@forthtilliath/shadcn-ui/components/sonner";

import { ModeToggle } from "./mode-toggle";
import { ThemeProvider } from "./theme-provider";

import "@forthtilliath/shadcn-ui/styles/globals.css";
import "@forthtilliath/shadcn-ui/styles/themes/twitter.css";

export const metadata: Metadata = {
  title: "@forthtilliath/shadcn-ui",
  description:
    "Every component in @forthtilliath/shadcn-ui, consumed the same way a downstream project would: as an installed package.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
              <Link href="/" className="font-semibold">
                @forthtilliath/shadcn-ui
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/sidebar"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Sidebar demo
                </Link>
                <ModeToggle />
              </div>
            </div>
          </header>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

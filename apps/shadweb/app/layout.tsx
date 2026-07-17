import type { Metadata } from "next";

import { Toaster } from "@forthtilliath/shadcn-ui/components/sonner";

import { ThemeProvider } from "./theme-provider";

import "@forthtilliath/shadcn-ui/styles/globals.css";
import "@forthtilliath/shadcn-ui/styles/themes/violet.css";

export const metadata: Metadata = {
  title: "Acme Analytics — built with @forthtilliath/shadcn-ui",
  description:
    "A fictional product built entirely from @forthtilliath/shadcn-ui, consumed the same way a downstream project would: as an installed package.",
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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

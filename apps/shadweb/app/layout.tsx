import type { Metadata } from "next";

import { ThemeProvider } from "@forthtilliath/forth-ui/components/mode-toggle";
import { Toaster } from "@forthtilliath/shadcn-ui/components/sonner";

import "./globals.css";

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

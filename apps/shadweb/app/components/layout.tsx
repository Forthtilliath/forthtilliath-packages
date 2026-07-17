import Link from "next/link";

import { ModeToggle } from "../mode-toggle";
import { navLinks } from "../nav-links";

export default function ComponentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            ← Back to Acme Analytics
          </Link>
          <ModeToggle />
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-10">
        <nav className="sticky top-20 hidden h-fit w-56 shrink-0 flex-col gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-1.5 text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <main className="min-w-0 flex-1 space-y-16">{children}</main>
      </div>
    </div>
  );
}

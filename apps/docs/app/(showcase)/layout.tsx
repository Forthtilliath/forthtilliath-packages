import { navLinks } from "../nav-links";

export default function ShowcaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}

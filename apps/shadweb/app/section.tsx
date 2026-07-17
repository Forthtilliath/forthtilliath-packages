import type { ReactNode } from "react";

import { Separator } from "@forthtilliath/shadcn-ui/components/separator";

interface SectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Section({ id, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {children}
      <Separator />
    </section>
  );
}

interface DemoProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function Demo({ label, children, className }: DemoProps) {
  return (
    <div className="rounded-lg border p-6">
      <p className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className={className ?? "flex flex-wrap items-center gap-4"}>
        {children}
      </div>
    </div>
  );
}

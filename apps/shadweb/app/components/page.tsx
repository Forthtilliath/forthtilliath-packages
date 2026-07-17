import { BadgesSection } from "../sections/badges";
import { ButtonsSection } from "../sections/buttons";
import { LayoutSection } from "../sections/containers";
import { DataDisplaySection } from "../sections/data-display";
import { DataTableExampleSection } from "../sections/data-table-example";
import { FeedbackSection } from "../sections/feedback";
import { FormExampleSection } from "../sections/form-example";
import { CalendarSection, FormsSection } from "../sections/forms";
import { MenusSection } from "../sections/menus";
import { NavigationSection } from "../sections/navigation";
import { OverlaysSection } from "../sections/overlays";

export default function ComponentsPage() {
  return (
    <div className="space-y-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Component reference
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Every component in{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-sm">
            @forthtilliath/shadcn-ui
          </code>
          , in isolation. Acme Analytics (the dashboard this reference is linked
          from) uses the same package, imported via{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-sm">
            workspace:*
          </code>{" "}
          in its own{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-sm">
            package.json
          </code>
          , not raw source aliasing.
        </p>
      </div>

      <ButtonsSection />
      <BadgesSection />
      <FormsSection />
      <FormExampleSection />
      <CalendarSection />
      <LayoutSection />
      <OverlaysSection />
      <MenusSection />
      <DataDisplaySection />
      <DataTableExampleSection />
      <FeedbackSection />
      <NavigationSection />
    </div>
  );
}

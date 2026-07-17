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

export default function Home() {
  return (
    <div className="space-y-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          @forthtilliath/shadcn-ui
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Every component in the package, rendered here exactly the way a
          downstream project would use it — this app depends on{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-sm">
            @forthtilliath/shadcn-ui
          </code>{" "}
          via{" "}
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

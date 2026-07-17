import { AspectRatio } from "@forthtilliath/shadcn-ui/components/aspect-ratio";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@forthtilliath/shadcn-ui/components/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@forthtilliath/shadcn-ui/components/resizable";
import { ScrollArea } from "@forthtilliath/shadcn-ui/components/scroll-area";

import { Demo, Section } from "../section";

export function LayoutSection() {
  return (
    <Section
      id="layout"
      title="Layout & Containers"
      description="Card, AspectRatio, ScrollArea, Resizable, Collapsible."
    >
      <Demo label="Card" className="max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Deploy your new project in one click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Card content goes here.
            </p>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </Demo>
      <Demo label="Aspect ratio" className="max-w-sm">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md" />
      </Demo>
      <Demo label="Scroll area" className="max-w-sm">
        <ScrollArea className="h-40 rounded-md border p-4">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <p key={n} className="text-sm">
              Scrollable row {n}
            </p>
          ))}
        </ScrollArea>
      </Demo>
      <Demo label="Resizable panels" className="max-w-md">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-32 rounded-md border"
        >
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center text-sm">
              Panel A
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center text-sm">
              Panel B
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Demo>
      <Demo label="Collapsible" className="max-w-sm space-y-2">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              Toggle details
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="text-muted-foreground pt-2 text-sm">
            Extra content revealed when expanded.
          </CollapsibleContent>
        </Collapsible>
      </Demo>
    </Section>
  );
}

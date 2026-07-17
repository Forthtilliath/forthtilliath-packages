import { Bold, Italic, Underline } from "lucide-react";

import { Button } from "@forthtilliath/shadcn-ui/components/button";
import { Toggle } from "@forthtilliath/shadcn-ui/components/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@forthtilliath/shadcn-ui/components/toggle-group";

import { Demo, Section } from "../section";

export function ButtonsSection() {
  return (
    <Section
      id="buttons"
      title="Buttons & Toggles"
      description="Button, Toggle and ToggleGroup."
    >
      <Demo label="Button variants">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </Demo>
      <Demo label="Button sizes">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Bold">
          <Bold />
        </Button>
      </Demo>
      <Demo label="Toggle">
        <Toggle aria-label="Toggle bold">
          <Bold />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle italic">
          <Italic />
        </Toggle>
        <Toggle size="lg" defaultPressed aria-label="Toggle underline">
          <Underline />
        </Toggle>
      </Demo>
      <Demo label="Toggle group (single)">
        <ToggleGroup type="single" defaultValue="bold" variant="outline">
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      </Demo>
    </Section>
  );
}

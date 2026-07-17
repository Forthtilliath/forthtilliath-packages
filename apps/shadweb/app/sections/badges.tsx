import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@forthtilliath/shadcn-ui/components/avatar";
import { Badge } from "@forthtilliath/shadcn-ui/components/badge";

import { Demo, Section } from "../section";

export function BadgesSection() {
  return (
    <Section
      id="badges"
      title="Badges & Avatars"
      description="Badge and Avatar."
    >
      <Demo label="Badge variants">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </Demo>
      <Demo label="Avatar">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>FT</AvatarFallback>
        </Avatar>
      </Demo>
    </Section>
  );
}

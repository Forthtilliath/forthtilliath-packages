"use client";

import { useState } from "react";
import { MessageSquare, Shield, Trash2, UserPlus } from "lucide-react";

import { Badge } from "@forthtilliath/shadcn-ui/components/badge";
import { Avatar as AvatarBlock } from "@forthtilliath/shadcn-ui/components/blocks/avatar";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import { Card, CardContent } from "@forthtilliath/shadcn-ui/components/card";
import { Checkbox } from "@forthtilliath/shadcn-ui/components/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@forthtilliath/shadcn-ui/components/context-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@forthtilliath/shadcn-ui/components/hover-card";
import { Input } from "@forthtilliath/shadcn-ui/components/input";
import { Label } from "@forthtilliath/shadcn-ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@forthtilliath/shadcn-ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@forthtilliath/shadcn-ui/components/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@forthtilliath/shadcn-ui/components/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@forthtilliath/shadcn-ui/components/tooltip";
import { toast } from "@forthtilliath/shadcn-ui/lib/sonner";

interface Member {
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  bio: string;
  online: boolean;
}

const members: Member[] = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@acme.dev",
    role: "Admin",
    bio: "Founding engineer. Owns billing and auth.",
    online: true,
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@acme.dev",
    role: "Editor",
    bio: "Design systems. Maintains the component library.",
    online: true,
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@acme.dev",
    role: "Viewer",
    bio: "Customer success. Read-only access to reports.",
    online: false,
  },
  {
    name: "William Kim",
    email: "will@acme.dev",
    role: "Editor",
    bio: "Backend. Owns the data pipeline.",
    online: false,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default function TeamPage() {
  const [accessLevel, setAccessLevel] = useState("full");

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="text-muted-foreground text-sm">
            Manage who has access to Acme Analytics. Right-click a member for
            more actions.
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <UserPlus />
              Invite member
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Invite a team member</SheetTitle>
              <SheetDescription>
                They&apos;ll receive an email invite to join Acme Analytics.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 px-4">
              <div className="space-y-2">
                <Label htmlFor="team-email">Email</Label>
                <Input
                  id="team-email"
                  type="email"
                  placeholder="teammate@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-role">Role</Label>
                <Select defaultValue="viewer">
                  <SelectTrigger id="team-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Access level</Label>
                <RadioGroup value={accessLevel} onValueChange={setAccessLevel}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="full" id="team-access-full" />
                    <Label htmlFor="team-access-full" className="font-normal">
                      Full workspace access
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="limited" id="team-access-limited" />
                    <Label
                      htmlFor="team-access-limited"
                      className="font-normal"
                    >
                      Limited to assigned projects
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="team-welcome-email" defaultChecked />
                <Label htmlFor="team-welcome-email" className="font-normal">
                  Send a welcome email
                </Label>
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  onClick={() => {
                    toast("Invite sent");
                  }}
                >
                  Send invite
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <ContextMenu key={member.email}>
            <ContextMenuTrigger>
              <Card>
                <CardContent className="flex items-center gap-3">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="rounded-full">
                        <AvatarBlock
                          src=""
                          alt={member.name}
                          fallback={initials(member.name)}
                          ring={member.online}
                        />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-muted-foreground">{member.bio}</p>
                    </HoverCardContent>
                  </HoverCard>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{member.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {member.email}
                    </p>
                  </div>
                  <Badge variant="secondary">{member.role}</Badge>
                </CardContent>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => {
                  toast(`Message sent to ${member.name}`);
                }}
              >
                <MessageSquare />
                Message
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => {
                  toast(`${member.name} is now an Admin`);
                }}
              >
                <Shield />
                Make admin
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                variant="destructive"
                onClick={() => {
                  toast(`${member.name} removed from the team`);
                }}
              >
                <Trash2 />
                Remove from team
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Two-factor authentication</p>
            <p className="text-muted-foreground text-sm">
              Require all team members to enable 2FA.
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Shield />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Enforce 2FA for the workspace</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </Card>
    </>
  );
}

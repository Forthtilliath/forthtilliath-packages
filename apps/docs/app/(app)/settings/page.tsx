"use client";

import { toast } from "sonner";
import { z } from "zod/v4";

import { Form } from "@forthtilliath/shadcn-ui/components/blocks/form";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import { Input } from "@forthtilliath/shadcn-ui/components/input";
import { Label } from "@forthtilliath/shadcn-ui/components/label";
import { Separator } from "@forthtilliath/shadcn-ui/components/separator";
import { Switch } from "@forthtilliath/shadcn-ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@forthtilliath/shadcn-ui/components/tabs";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Invalid email address."),
});

type ProfileValues = z.infer<typeof profileSchema>;

const notificationItems = [
  {
    id: "marketing",
    label: "Marketing emails",
    description: "Receive emails about new products and features.",
    defaultChecked: false,
  },
  {
    id: "security",
    label: "Security emails",
    description: "Receive emails about your account security.",
    defaultChecked: true,
  },
  {
    id: "activity",
    label: "Activity digest",
    description: "Get a weekly summary of account activity.",
    defaultChecked: true,
  },
];

export default function SettingsPage() {
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your account profile information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                schema={profileSchema}
                defaultValues={{ name: "Vincent", email: "vincent@acme.dev" }}
                onSubmit={(data: ProfileValues) => {
                  toast("Profile updated", {
                    description: JSON.stringify(data),
                  });
                }}
                className="max-w-sm space-y-4"
              >
                {({ register }) => (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="settings-name">Name</Label>
                      <Input id="settings-name" {...register("name")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="settings-email">Email</Label>
                      <Input
                        id="settings-email"
                        type="email"
                        {...register("email")}
                      />
                    </div>
                    <Button type="submit">Save changes</Button>
                  </>
                )}
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Choose what you want to be notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationItems.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id}>{item.label}</Label>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                    <Switch id={item.id} defaultChecked={item.defaultChecked} />
                  </div>
                  {index < notificationItems.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

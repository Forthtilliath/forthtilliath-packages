"use client";

import { toast } from "sonner";
import { z } from "zod/v4";

import { Form } from "@forthtilliath/shadcn-ui/components/blocks/form";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import { Input } from "@forthtilliath/shadcn-ui/components/input";
import { Label } from "@forthtilliath/shadcn-ui/components/label";

import { Demo, Section } from "../section";

const schema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  email: z.email("Invalid email address."),
});

type FormValues = z.infer<typeof schema>;

export function FormExampleSection() {
  return (
    <Section
      id="form-example"
      title="Complete Form"
      description="blocks/form.tsx wraps react-hook-form + zod validation into a single component."
    >
      <Demo label="Form" className="block max-w-sm">
        <Form
          schema={schema}
          defaultValues={{ username: "", email: "" }}
          onSubmit={(data: FormValues) => {
            toast("Form submitted", { description: JSON.stringify(data) });
          }}
          className="space-y-4"
        >
          {({ register }) => (
            <>
              <div className="space-y-2">
                <Label htmlFor="docs-username">Username</Label>
                <Input id="docs-username" {...register("username")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="docs-form-email">Email</Label>
                <Input
                  id="docs-form-email"
                  type="email"
                  {...register("email")}
                />
              </div>
              <Button type="submit">Submit</Button>
            </>
          )}
        </Form>
      </Demo>
    </Section>
  );
}

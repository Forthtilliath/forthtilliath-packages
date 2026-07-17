"use client";

import { AlertCircle, Terminal } from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@forthtilliath/shadcn-ui/components/alert";
import { Button } from "@forthtilliath/shadcn-ui/components/button";

import { Demo, Section } from "../section";

export function FeedbackSection() {
  return (
    <Section
      id="feedback"
      title="Alerts & Toasts"
      description="Alert and Sonner (toast)."
    >
      <Demo label="Alert" className="block max-w-lg space-y-4">
        <Alert>
          <Terminal />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components using the CLI.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
      </Demo>

      <Demo label="Toast (Sonner)">
        <Button
          variant="outline"
          onClick={() => {
            toast("Event has been created", {
              description: new Date().toLocaleString(),
              action: {
                label: "Undo",
                onClick: () => {
                  toast.dismiss();
                },
              },
            });
          }}
        >
          Show toast
        </Button>
      </Demo>
    </Section>
  );
}

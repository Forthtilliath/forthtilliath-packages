"use client";

import { Button } from "@forthtilliath/shadcn-ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import { Checkbox } from "@forthtilliath/shadcn-ui/components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@forthtilliath/shadcn-ui/components/collapsible";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@forthtilliath/shadcn-ui/components/input-otp";
import { Label } from "@forthtilliath/shadcn-ui/components/label";
import { Textarea } from "@forthtilliath/shadcn-ui/components/textarea";
import { toast } from "@forthtilliath/shadcn-ui/lib/sonner";

export function ContactCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact support</CardTitle>
        <CardDescription>We usually reply within a few hours.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="Describe your issue..." rows={4} />
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="link" className="h-auto p-0">
              Advanced options
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-3">
            <div className="space-y-2">
              <Label>Verify phone number</Label>
              <InputOTP maxLength={4}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="support-notify" defaultChecked />
              <Label htmlFor="support-notify" className="font-normal">
                Notify me by email
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Button
          className="w-full"
          onClick={() => {
            toast("Support ticket submitted");
          }}
        >
          Submit ticket
        </Button>
      </CardContent>
    </Card>
  );
}

import { Calendar } from "@forthtilliath/shadcn-ui/components/calendar";
import { Checkbox } from "@forthtilliath/shadcn-ui/components/checkbox";
import { Input } from "@forthtilliath/shadcn-ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@forthtilliath/shadcn-ui/components/input-otp";
import { Label } from "@forthtilliath/shadcn-ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@forthtilliath/shadcn-ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@forthtilliath/shadcn-ui/components/select";
import { Slider } from "@forthtilliath/shadcn-ui/components/slider";
import { Switch } from "@forthtilliath/shadcn-ui/components/switch";
import { Textarea } from "@forthtilliath/shadcn-ui/components/textarea";

import { Demo, Section } from "../section";

export function FormsSection() {
  return (
    <Section
      id="forms"
      title="Form Inputs"
      description="Input, Textarea, Checkbox, RadioGroup, Select, Switch, Slider, InputOTP."
    >
      <Demo label="Input & Label" className="max-w-sm space-y-2">
        <Label htmlFor="docs-email">Email</Label>
        <Input id="docs-email" type="email" placeholder="you@example.com" />
      </Demo>
      <Demo label="Textarea" className="max-w-sm space-y-2">
        <Label htmlFor="docs-message">Message</Label>
        <Textarea id="docs-message" placeholder="Type your message here." />
      </Demo>
      <Demo label="Checkbox">
        <div className="flex items-center gap-2">
          <Checkbox id="docs-terms" defaultChecked />
          <Label htmlFor="docs-terms">Accept terms and conditions</Label>
        </div>
      </Demo>
      <Demo label="Radio group">
        <RadioGroup defaultValue="comfortable" className="gap-3">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="default" id="docs-r1" />
            <Label htmlFor="docs-r1">Default</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="comfortable" id="docs-r2" />
            <Label htmlFor="docs-r2">Comfortable</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="compact" id="docs-r3" />
            <Label htmlFor="docs-r3">Compact</Label>
          </div>
        </RadioGroup>
      </Demo>
      <Demo label="Select">
        <Select defaultValue="blueberry">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Demo>
      <Demo label="Switch">
        <div className="flex items-center gap-2">
          <Switch id="docs-airplane-mode" defaultChecked />
          <Label htmlFor="docs-airplane-mode">Airplane mode</Label>
        </div>
      </Demo>
      <Demo label="Slider" className="max-w-sm">
        <Slider defaultValue={[50]} max={100} step={1} />
      </Demo>
      <Demo label="Input OTP">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Demo>
    </Section>
  );
}

export function CalendarSection() {
  return (
    <Section
      id="calendar"
      title="Calendar & Dates"
      description="Calendar, built on react-day-picker."
    >
      <Demo label="Calendar">
        <Calendar
          mode="single"
          defaultMonth={new Date()}
          selected={new Date()}
          className="rounded-md border"
        />
      </Demo>
    </Section>
  );
}

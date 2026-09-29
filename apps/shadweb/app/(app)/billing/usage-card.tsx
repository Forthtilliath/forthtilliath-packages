import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import { Progress } from "@forthtilliath/shadcn-ui/components/progress";
import { Slider } from "@forthtilliath/shadcn-ui/components/slider";

export function UsageCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Current billing period.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>API calls</span>
            <span className="text-muted-foreground">72,400 / 100,000</span>
          </div>
          <Progress value={72} />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Storage</span>
            <span className="text-muted-foreground">4.1 GB / 10 GB</span>
          </div>
          <Progress value={41} />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Seats</span>
            <span className="text-muted-foreground">6 / 10</span>
          </div>
          <Slider defaultValue={[6]} max={10} step={1} />
        </div>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import { ScrollArea } from "@forthtilliath/shadcn-ui/components/scroll-area";

const activity = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  text: `Ticket #${String(1042 - i)} updated ${String(i + 1)}h ago`,
}));

export function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <div className="space-y-2 pr-4">
            {activity.map((item) => (
              <p key={item.id} className="text-muted-foreground text-sm">
                {item.text}
              </p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

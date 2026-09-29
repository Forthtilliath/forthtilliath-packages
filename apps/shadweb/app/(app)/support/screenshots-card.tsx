import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@forthtilliath/shadcn-ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@forthtilliath/shadcn-ui/components/carousel";

export function ScreenshotsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket #1042 screenshots</CardTitle>
        <CardDescription>Attached by the customer.</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel>
          <CarouselContent>
            {[1, 2, 3].map((n) => (
              <CarouselItem key={n}>
                <div className="bg-muted flex h-32 items-center justify-center rounded-md text-sm font-medium">
                  Screenshot {n}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
}

"use client";

import { AnimatedText } from "@forthtilliath/shadcn-ui/components/blocks/animated-text";

export function WelcomeHeader() {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">
        <AnimatedText variant="reveal" split="word">
          Welcome back, Vincent
        </AnimatedText>
      </h1>
      <p className="text-muted-foreground text-sm">
        Here&apos;s what&apos;s happening with Acme Analytics today.
      </p>
    </div>
  );
}

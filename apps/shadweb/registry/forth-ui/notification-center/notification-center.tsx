"use client";

import type React from "react";
import { BellIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/forth-ui/badge";
import { Button } from "@/components/forth-ui/button";

export interface NotificationItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  date?: React.ReactNode;
  read?: boolean;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  onNotificationClick?: (id: string) => void;
  onMarkAllRead?: () => void;
  emptyMessage?: string;
  className?: string;
}

/**
 * A bell-icon trigger with an unread-count badge, opening a popover list
 * of notifications — a presentational shell only (no push/realtime
 * transport), since that's inherently app-specific.
 *
 * @see https://www.rigidui.com/docs/components/notification-center
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function NotificationCenter({
  notifications,
  onNotificationClick,
  onMarkAllRead,
  emptyMessage = "No notifications",
  className,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(
    (notification) => notification.read !== true,
  ).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <BellIcon />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              size="sm"
              className="absolute -top-1 -right-1 size-4 justify-center rounded-full p-0"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-80 p-0", className)} align="end">
        <div className="flex items-center justify-between border-b p-3">
          <p className="text-sm font-medium">Notifications</p>
          {unreadCount > 0 && onMarkAllRead !== undefined && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-muted-foreground p-6 text-center text-sm">
              {emptyMessage}
            </p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  onNotificationClick?.(notification.id);
                }}
                className={cn(
                  "hover:bg-accent flex w-full flex-col gap-0.5 border-b p-3 text-left last:border-0",
                  notification.read !== true && "bg-accent/40",
                )}
              >
                <p className="text-sm font-medium">{notification.title}</p>
                {notification.description !== undefined && (
                  <p className="text-muted-foreground text-xs">
                    {notification.description}
                  </p>
                )}
                {notification.date !== undefined && (
                  <p className="text-muted-foreground text-xs">
                    {notification.date}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Unread indicator. The count comes from the `notifications` table for the
 * signed-in user; there is nothing to show until the app writes one.
 */
export function NotificationBell({ unreadCount }: { unreadCount: number }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={
        unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications, none unread"
      }
    >
      <Bell className="size-4.5" strokeWidth={1.75} />
      {unreadCount > 0 ? (
        <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-brand-spark" />
      ) : null}
    </Button>
  );
}

"use client";

import {
  Bell,
  ListChecks,
  CircleCheck,
  Megaphone,
  CalendarDays,
  Trophy,
  Library,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockNotifications, type NotificationType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// One icon per notification type. The list is closed on purpose: the app only
// notifies about things it can actually do.
const TYPE_ICONS: Record<NotificationType, LucideIcon> = {
  task_assigned: ListChecks,
  task_completed: CircleCheck,
  announcement: Megaphone,
  event_reminder: CalendarDays,
  competition_deadline: Trophy,
  resource_uploaded: Library,
};

export function NotificationBell() {
  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications (${unreadCount} unread)`}>
            <Bell className="size-4.5" strokeWidth={1.75} />
            {unreadCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-brand-spark" />
            ) : null}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {mockNotifications.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
        ) : (
          mockNotifications.map((n) => {
            const Icon = TYPE_ICONS[n.type];
            return (
              <DropdownMenuItem key={n.id} className="flex items-start gap-2.5 whitespace-normal py-2.5">
                <Icon
                  className={cn("mt-0.5 size-4 shrink-0", n.unread ? "text-primary" : "text-muted-foreground")}
                  strokeWidth={1.75}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-0.5 font-mono text-[0.65rem] text-muted-foreground">{n.time}</p>
                </div>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

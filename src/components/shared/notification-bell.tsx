"use client";

import { Bell } from "lucide-react";
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
import { mockNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
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
          mockNotifications.map((n) => (
            <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 whitespace-normal py-2.5">
              <div className="flex w-full items-center gap-2">
                <span className={cn("size-1.5 rounded-full", n.unread ? "bg-primary" : "bg-transparent")} />
                <span className="text-sm font-medium">{n.title}</span>
              </div>
              <span className="pl-3.5 text-xs text-muted-foreground">{n.body}</span>
              <span className="pl-3.5 font-mono text-[0.65rem] text-muted-foreground">{n.time}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

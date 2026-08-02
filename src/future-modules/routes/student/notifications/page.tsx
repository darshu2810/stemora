"use client";

import * as React from "react";
import {
  Bell,
  GraduationCap,
  UserPlus,
  AtSign,
  CalendarDays,
  Award,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { mockFullNotifications as initial, type NotificationType, type FullNotification } from "@/lib/mock-data";

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  grade: GraduationCap,
  invite: UserPlus,
  mention: AtSign,
  event: CalendarDays,
  achievement: Award,
  message: MessagesSquare,
};

const TABS: { value: NotificationType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "achievement", label: "Achievements" },
  { value: "grade", label: "Grades" },
  { value: "message", label: "Messages" },
  { value: "event", label: "Events" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<FullNotification[]>(initial);
  const [tab, setTab] = React.useState<NotificationType | "all">("all");

  const filtered = notifications.filter((n) => tab === "all" || n.type === tab);
  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Notifications"
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread.` : "You're all caught up."}
        actions={
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => v && setTab(v as NotificationType | "all")}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="Nothing here" description="You're all caught up in this category." />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {filtered.map((n) => {
            const Icon = TYPE_ICON[n.type];
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-secondary/40",
                  n.unread && "bg-primary/5"
                )}
              >
                <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", n.unread ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                  <Icon className="size-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {n.unread ? <span className="size-1.5 shrink-0 rounded-full bg-primary" /> : null}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{n.time}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

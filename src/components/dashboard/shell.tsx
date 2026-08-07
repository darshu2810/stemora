"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NotificationBell } from "@/components/shared/notification-bell";
import { UserMenu } from "@/components/dashboard/user-menu";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { platformNav, schoolNav, studentNav } from "@/config/navigation";
import type { UserRole } from "@/config/roles";

// Icon components can't cross the server/client boundary as props (they're
// functions), so this Client Component owns the nav-config import itself —
// the layout only ever passes a plain string variant.
const NAV_BY_VARIANT = {
  platform: platformNav,
  school: schoolNav,
  student: studentNav,
} as const;

const ROLE_BY_VARIANT: Record<keyof typeof NAV_BY_VARIANT, UserRole> = {
  platform: "platform_owner",
  school: "school_admin",
  student: "student",
};

export function DashboardShell({
  variant,
  contextLabel,
  user,
  unreadCount,
  children,
}: {
  variant: keyof typeof NAV_BY_VARIANT;
  contextLabel: string;
  user: { name: string; email: string; initials: string };
  unreadCount: number;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navItems = NAV_BY_VARIANT[variant];
  const role = ROLE_BY_VARIANT[variant];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <div className="px-5 pb-3">
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-sidebar-foreground/50">
            {contextLabel}
          </span>
        </div>
        <SidebarNav items={navItems} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                    <Menu className="size-5" />
                  </Button>
                }
              />

              <SheetContent side="left" className="w-64 bg-sidebar p-0">
                <SheetHeader className="h-16 justify-center px-5">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="px-5 pb-3">
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-sidebar-foreground/50">
                    {contextLabel}
                  </span>
                </div>
                <SidebarNav items={navItems} onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="font-mono text-xs text-muted-foreground md:hidden">{contextLabel}</span>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NotificationBell unreadCount={unreadCount} />
            <UserMenu name={user.name} email={user.email} role={role} initials={user.initials} />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 py-8 md:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

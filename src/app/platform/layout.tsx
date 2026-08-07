import { DashboardShell } from "@/components/dashboard/shell";
import { requireSession } from "@/lib/auth/session";
import { initialsOf } from "@/lib/utils";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession("platform_owner");

  return (
    <DashboardShell
      variant="platform"
      contextLabel="STEMORA PLATFORM"
      user={{
        name: session.fullName,
        email: session.email,
        initials: initialsOf(session.fullName),
      }}
      unreadCount={0}
    >
      {children}
    </DashboardShell>
  );
}

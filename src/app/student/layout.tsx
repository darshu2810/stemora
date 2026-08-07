import { DashboardShell } from "@/components/dashboard/shell";
import { requireStudent } from "@/lib/auth/session";
import { initialsOf } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStudent();
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.userId)
    .is("read_at", null);

  return (
    <DashboardShell
      variant="student"
      contextLabel={(session.schoolName ?? "").toUpperCase()}
      user={{
        name: session.fullName,
        email: session.email,
        initials: initialsOf(session.fullName),
      }}
      unreadCount={count ?? 0}
    >
      {children}
    </DashboardShell>
  );
}

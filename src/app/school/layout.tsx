import { DashboardShell } from "@/components/dashboard/shell";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { initialsOf } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";

export default async function SchoolLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.userId)
    .is("read_at", null);

  return (
    <DashboardShell
      variant="school"
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

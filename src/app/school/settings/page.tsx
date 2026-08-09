import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SettingsView } from "@/components/settings/settings-view";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { getClubStats, listAccess } from "@/lib/db/queries";

export default async function SettingsPage() {
  const session = await requireSchoolAdmin();
  const [stats, people] = await Promise.all([
    getClubStats(session.schoolId),
    listAccess(session.schoolId),
  ]);

  const admins = people.filter((p) => p.role === "school_admin" && p.status === "active");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={session.schoolName ?? "Your school"}
        title="Settings"
        description="Your school runs one STEM Club. These are its details."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Students" value={String(stats.students)} />
        <StatCard label="Projects" value={String(stats.projects)} />
        <StatCard label="School Admins" value={String(admins.length)} />
      </div>

      <SettingsView
        schoolName={session.schoolName ?? ""}
        clubName={session.clubName ?? ""}
        district={session.district}
        admins={admins.map((a) => ({ id: a.userId, name: a.name, email: a.email }))}
        studentCount={stats.students}
      />
    </div>
  );
}

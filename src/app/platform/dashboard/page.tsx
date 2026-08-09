import { Building2, Users2, MailQuestion } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import { requireSession } from "@/lib/auth/session";
import { listSchoolsForPlatform } from "@/lib/db/queries";

/**
 * What the Platform Owner can see is bounded by RLS, not by this page: schools
 * and who belongs to them, never what a club is working on. That is why there
 * is no project or announcement count here — the role cannot read them, so any
 * number shown would be a zero pretending to be a fact.
 */
export default async function PlatformDashboardPage() {
  await requireSession("platform_owner");
  const schools = await listSchoolsForPlatform();

  const totalStudents = schools.reduce((sum, s) => sum + s.students, 0);
  const totalPending = schools.reduce((sum, s) => sum + s.pending, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA"
        title="Schools"
        description="Every school running a STEM Club on STEMORA. One school per workspace, one STEM Club per school."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Schools" value={String(schools.length)} icon={Building2} />
        <StatCard label="Students" value={String(totalStudents)} icon={Users2} />
        <StatCard label="Pending invitations" value={String(totalPending)} icon={MailQuestion} />
      </div>

      {schools.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No schools yet"
          description="When a School Admin registers their school, it will appear here."
        />
      ) : (
        <div className="space-y-3">
          {schools.map((school) => (
            <div key={school.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  {school.district ? (
                    <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      {school.district}
                    </p>
                  ) : null}
                  <h2 className="mt-1 font-display font-semibold">{school.name}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">{school.clubName}</p>
                </div>
                <StatusBadge status={school.status === "active" ? "active" : "suspended"} label={school.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users2 className="size-3" /> {school.students} {school.students === 1 ? "student" : "students"}
                </span>
                <span>{school.admins} {school.admins === 1 ? "admin" : "admins"}</span>
                {school.pending > 0 ? <span>{school.pending} pending</span> : null}
                <span>Registered {formatDate(school.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

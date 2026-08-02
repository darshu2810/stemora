import { Building2, Users2, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { mockSchool, clubStats } from "@/lib/mock-data";

// STEMORA is piloting with one school. This page shows exactly that — no
// projected growth curves, no revenue, and no data from inside the school's
// club, which the Platform Owner has no business seeing.
const PILOT_SCHOOLS = [
  {
    id: mockSchool.id,
    name: mockSchool.name,
    district: mockSchool.district,
    clubName: mockSchool.clubName,
    students: clubStats.students,
    projects: clubStats.projects,
    joinedAt: "2025-07-14",
  },
];

export default function PlatformDashboardPage() {
  const totalStudents = PILOT_SCHOOLS.reduce((sum, s) => sum + s.students, 0);
  const totalProjects = PILOT_SCHOOLS.reduce((sum, s) => sum + s.projects, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA"
        title="Schools"
        description="Every school running a STEM Club on STEMORA. One school per workspace, one STEM Club per school."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Schools" value={String(PILOT_SCHOOLS.length)} icon={Building2} />
        <StatCard label="Students" value={String(totalStudents)} icon={Users2} />
        <StatCard label="Projects" value={String(totalProjects)} icon={FolderKanban} />
      </div>

      <div className="space-y-3">
        {PILOT_SCHOOLS.map((school) => (
          <div key={school.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  {school.district}
                </p>
                <h2 className="mt-1 font-display font-semibold">{school.name}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{school.clubName}</p>
              </div>
              <StatusBadge status="active" label="pilot" />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users2 className="size-3" /> {school.students} students</span>
              <span className="flex items-center gap-1"><FolderKanban className="size-3" /> {school.projects} projects</span>
              <span>Joined {formatDate(school.joinedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

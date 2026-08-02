import Link from "next/link";
import { LayoutGrid, Users2, ShieldCheck, FolderKanban, ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Progress } from "@/components/ui/progress";
import {
  mockSchool,
  mockClubs,
  mockAnnouncements,
  mockEvents,
  mockProjects,
  mockClubLeaders,
  getProjectBoard,
  BOARD_COLUMNS,
} from "@/lib/mock-data";

export default function SchoolDashboardPage() {
  const pinnedAnnouncements = mockAnnouncements.filter((a) => a.pinned).slice(0, 3);
  const upcomingEvents = [...mockEvents].sort((a, b) => (a.date < b.date ? -1 : 1)).slice(0, 4);
  const activeProjects = mockProjects.filter((p) => p.status === "active").slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.name}
        title="School overview"
        description="A pulse on every club running this term."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clubs" value={String(mockSchool.clubCount)} icon={LayoutGrid} />
        <StatCard label="Members" value={String(mockSchool.memberCount)} icon={Users2} delta={{ value: "+12 this month", direction: "up" }} />
        <StatCard label="Club leaders" value={String(mockClubLeaders.length)} icon={ShieldCheck} />
        <StatCard label="Active projects" value={String(mockProjects.filter((p) => p.status === "active").length)} icon={FolderKanban} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Pinned announcements</h2>
            <Link href="/school/announcements" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {pinnedAnnouncements.map((a) => (
              <div key={a.id}>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.club ?? "School-wide"} · {a.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Upcoming events</h2>
            <Link href="/school/events" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {upcomingEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {e.location} · {e.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Active projects</h2>
          <Link href="/school/projects" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activeProjects.map((p) => {
            const board = getProjectBoard(p.id);
            const total = BOARD_COLUMNS.reduce((sum, c) => sum + board[c.id].length, 0);
            const done = board.done.length;
            return (
              <Link
                key={p.id}
                href={`/school/projects/${p.id}`}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{p.clubName}</p>
                <h3 className="mt-1 font-display text-sm font-semibold">{p.name}</h3>
                <Progress value={total ? (done / total) * 100 : 0} className="mt-3 h-1.5" />
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold">Your clubs</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mockClubs.map((club) => (
            <div key={club.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className={`h-16 bg-gradient-to-br ${club.cover}`} />
              <div className="p-4">
                <h3 className="font-display text-sm font-semibold">{club.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {club.category} · {club.members} members
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

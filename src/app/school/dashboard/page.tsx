import Link from "next/link";
import {
  Users2,
  FolderKanban,
  Trophy,
  CalendarDays,
  ArrowRight,
  MapPin,
  Megaphone,
  Library,
  ListChecks,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import {
  mockSchool,
  mockProjects,
  mockAnnouncements,
  mockActivity,
  clubStats,
  upcomingEvents,
  openTasks,
  getProjectProgress,
  studentName,
} from "@/lib/mock-data";

const ACTIVITY_ICONS = {
  announcement: Megaphone,
  resource: Library,
  competition: Trophy,
  event: CalendarDays,
} as const;

export default function SchoolDashboardPage() {
  const pinned = mockAnnouncements.filter((a) => a.pinned).slice(0, 3);
  const events = upcomingEvents().slice(0, 4);
  const activeProjects = mockProjects.filter((p) => p.status === "active").slice(0, 4);
  // "Pending" is the club's real backlog: unfinished tasks, soonest first.
  const pending = openTasks().slice(0, 5);
  const activity = mockActivity.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.name}
        title={mockSchool.clubName}
        description={`${mockSchool.term} · everything the club is running right now.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students" value={String(clubStats.students)} icon={Users2} />
        <StatCard label="Active projects" value={String(clubStats.activeProjects)} icon={FolderKanban} />
        <StatCard label="Competitions" value={String(clubStats.competitions)} icon={Trophy} />
        <StatCard label="Upcoming events" value={String(clubStats.upcomingEvents)} icon={CalendarDays} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Pinned announcements</h2>
            <Link href="/school/announcements" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {pinned.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing is pinned right now.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {pinned.map((a) => (
                <div key={a.id}>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.author} · {formatDate(a.date)}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Upcoming events</h2>
            <Link href="/school/events" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {events.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No events are scheduled yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {events.map((e) => (
                <div key={e.id}>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {e.location} · {formatDate(e.date)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Active projects</h2>
          <Link href="/school/projects" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        {activeProjects.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={FolderKanban}
            title="No projects are running yet"
            description="Create the club's first project to start tracking its team and tasks."
          />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activeProjects.map((p) => {
              const { percent } = getProjectProgress(p.id);
              return (
                <Link
                  key={p.id}
                  href={`/school/projects/${p.id}`}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{p.category}</p>
                  <h3 className="mt-1 font-display text-sm font-semibold">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Led by {studentName(p.leaderId)}</p>
                  <Progress value={percent} className="mt-3 h-1.5" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display font-semibold">
            <ListChecks className="size-4 text-muted-foreground" strokeWidth={1.75} /> Pending tasks
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {openTasks().length} open across every project — soonest first.
          </p>
          <div className="mt-4 divide-y divide-border">
            {pending.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.projectName} · {t.assignee}</p>
                </div>
                <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  {formatDate(t.dueDate)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display font-semibold">Recent activity</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">The last things that happened in the club.</p>
          <div className="mt-4 space-y-3">
            {activity.map((item) => {
              const Icon = ACTIVITY_ICONS[item.kind];
              return (
                <div key={item.id} className="flex gap-2.5">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-sm">{item.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.actor} · {formatDate(item.date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

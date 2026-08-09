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
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { progressPercent } from "@/lib/board";
import {
  getClubStats,
  listAnnouncements,
  listEvents,
  listProjects,
  listOpenTasks,
  listRecentActivity,
  taskCountsByProject,
  todayISO,
} from "@/lib/db/queries";

const ACTIVITY_ICONS = {
  announcement: Megaphone,
  resource: Library,
  competition: Trophy,
  event: CalendarDays,
} as const;

export default async function SchoolDashboardPage() {
  const session = await requireSchoolAdmin();
  const schoolId = session.schoolId;

  const [stats, announcements, events, projects, openTasks, activity, taskCounts] =
    await Promise.all([
      getClubStats(schoolId),
      listAnnouncements(schoolId),
      listEvents(schoolId),
      listProjects(schoolId),
      listOpenTasks(schoolId, 5),
      listRecentActivity(schoolId, 5),
      taskCountsByProject(schoolId),
    ]);

  const today = todayISO();
  const pinned = announcements.filter((a) => a.pinned).slice(0, 3);
  const upcoming = events.filter((e) => e.event_date >= today).slice(0, 4);
  const activeProjects = projects.filter((p) => p.status === "active").slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={session.schoolName ?? "Your school"}
        title={session.clubName ?? "STEM Club"}
        description="Everything the club is running right now."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students" value={String(stats.students)} icon={Users2} />
        <StatCard label="Active projects" value={String(stats.activeProjects)} icon={FolderKanban} />
        <StatCard label="Competitions" value={String(stats.competitions)} icon={Trophy} />
        <StatCard label="Upcoming events" value={String(stats.upcomingEvents)} icon={CalendarDays} />
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
            <p className="mt-4 text-sm text-muted-foreground">
              {announcements.length === 0
                ? "No announcements yet."
                : "Nothing is pinned right now."}
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {pinned.map((a) => (
                <div key={a.id}>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.authorName} · {formatDate(a.created_at)}
                  </p>
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
          {upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No upcoming events.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {upcoming.map((e) => (
                <div key={e.id}>
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {e.location} · {formatDate(e.event_date)}
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
            title="No projects yet"
            description="Create the club's first project to start tracking its team and tasks."
          />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activeProjects.map((p) => (
              <Link
                key={p.id}
                href={`/school/projects/${p.id}`}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{p.category}</p>
                <h3 className="mt-1 font-display text-sm font-semibold">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.leaderName ? `Led by ${p.leaderName}` : "No project leader yet"}
                </p>
                <Progress value={progressPercent(taskCounts.get(p.id))} className="mt-3 h-1.5" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display font-semibold">
            <ListChecks className="size-4 text-muted-foreground" strokeWidth={1.75} /> Pending tasks
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {stats.openTasks === 0
              ? "Nothing outstanding."
              : `${stats.openTasks} open across every project — soonest first.`}
          </p>
          {openTasks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No tasks yet.</p>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {openTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.projectName}
                      {t.assigneeName ? ` · ${t.assigneeName}` : " · Unassigned"}
                    </p>
                  </div>
                  {t.due_date ? (
                    <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      {formatDate(t.due_date)}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display font-semibold">
            <Activity className="size-4 text-muted-foreground" strokeWidth={1.75} /> Recent activity
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">The last things that happened in the club.</p>
          {activity.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing has happened yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {activity.map((item) => {
                const Icon = ACTIVITY_ICONS[item.kind];
                return (
                  <div key={item.id} className="flex gap-2.5">
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                    <div className="min-w-0">
                      <p className="text-sm">{item.text}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.actor ? `${item.actor} · ` : ""}
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

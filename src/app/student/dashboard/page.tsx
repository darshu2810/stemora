import Link from "next/link";
import { ArrowRight, Award, MapPin, ListChecks, CalendarDays, FolderKanban, Trophy, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import {
  mockSchool,
  mockUsers,
  mockAnnouncements,
  mockCompetitions,
  mockAchievements,
  BADGE_DEFS,
  BOARD_COLUMNS,
  upcomingEvents,
  projectsForStudent,
  tasksForStudent,
  getProjectProgress,
} from "@/lib/mock-data";

const COLUMN_LABEL = Object.fromEntries(BOARD_COLUMNS.map((c) => [c.id, c.name]));

export default function StudentDashboardPage() {
  const student = mockUsers.student;
  const achievements = mockAchievements[student.id] ?? [];
  const myProjects = projectsForStudent(student.id);
  const myTasks = tasksForStudent(student.id);
  const openTaskList = myTasks.filter((t) => t.column !== "done");
  const events = upcomingEvents().slice(0, 3);
  const myCompetitions = mockCompetitions.filter(
    (c) => c.status === "upcoming" && c.participantIds.includes(student.id),
  );
  const latestAnnouncement = [...mockAnnouncements].sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
        title={`Welcome back, ${student.name.split(" ")[0]}`}
        description="Everything you owe the club, and everything coming up."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My projects" value={String(myProjects.length)} icon={FolderKanban} />
        <StatCard label="Open tasks" value={String(openTaskList.length)} icon={ListChecks} />
        <StatCard label="My competitions" value={String(myCompetitions.length)} icon={Trophy} />
        <StatCard label="Achievements" value={String(achievements.length)} icon={Award} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">My tasks</h2>
            <Link href="/student/tasks" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {myTasks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing is assigned to you right now.</p>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {myTasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.projectName} · Due {formatDate(t.dueDate)}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                    {COLUMN_LABEL[t.column]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Upcoming events</h2>
            <Link href="/student/events" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {events.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing is scheduled yet.</p>
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
          <h2 className="font-display text-lg font-semibold">My projects</h2>
          <Link href="/student/projects" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        {myProjects.length === 0 ? (
          <EmptyState
            className="mt-4"
            icon={FolderKanban}
            title="You're not on a project yet"
            description="Ask your School Admin to add you to a project team."
          />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myProjects.map((p) => {
              const { percent } = getProjectProgress(p.id);
              return (
                <Link
                  key={p.id}
                  href={`/student/projects/${p.id}`}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{p.category}</p>
                  <h3 className="mt-1 font-display text-sm font-semibold">{p.name}</h3>
                  <Progress value={percent} className="mt-3 h-1.5" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display font-semibold">
              <Megaphone className="size-4 text-muted-foreground" strokeWidth={1.75} /> Latest announcement
            </h2>
            <Link href="/student/announcements" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <p className="mt-4 text-sm font-medium">{latestAnnouncement.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{latestAnnouncement.body}</p>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {latestAnnouncement.author} · {formatDate(latestAnnouncement.date)}
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Recent achievements</h2>
            <Link href="/student/achievements" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {achievements.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Awards you earn for club work will appear here.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {achievements.slice(0, 3).map((a) => {
                const def = BADGE_DEFS.find((b) => b.id === a.badgeId)!;
                return (
                  <div key={a.badgeId} className="flex gap-2.5">
                    <Award className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} />
                    <div>
                      <p className="text-sm font-medium">{def.name}</p>
                      <p className="text-xs text-muted-foreground">{a.note ?? formatDate(a.earnedAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display font-semibold">
            <Trophy className="size-4 text-muted-foreground" strokeWidth={1.75} /> My upcoming competitions
          </h2>
          <Link href="/student/competitions" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        {myCompetitions.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            You&apos;re not on a competition roster yet — check the register for what the club is entering.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-border">
            {myCompetitions.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.category} · {c.level}</p>
                </div>
                <span className="shrink-0 flex items-center gap-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  <CalendarDays className="size-3" /> {formatDate(c.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

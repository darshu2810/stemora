import Link from "next/link";
import { ArrowRight, Award, MapPin, ListChecks, CalendarDays, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Progress } from "@/components/ui/progress";
import {
  mockUsers,
  mockEvents,
  mockProjects,
  mockStudentAchievements,
  BADGE_DEFS,
  getProjectBoard,
  BOARD_COLUMNS,
  type BoardCard,
} from "@/lib/mock-data";

type MyTask = BoardCard & { projectId: string; projectName: string };

const COLUMN_LABEL = Object.fromEntries(BOARD_COLUMNS.map((c) => [c.id, c.name]));

export default function StudentDashboardPage() {
  const student = mockUsers.student;
  const achievements = mockStudentAchievements[student.id] ?? [];
  const myProjects = mockProjects.filter((p) => p.clubName === student.club && p.status === "active").slice(0, 3);
  const upcomingEvents = [...mockEvents].sort((a, b) => (a.date < b.date ? -1 : 1)).slice(0, 3);

  // Same derivation MyTasksView uses — everything on a board assigned to you.
  // Outstanding work sorts first, then done, each by due date.
  const myTasks: MyTask[] = mockProjects
    .flatMap((project) =>
      BOARD_COLUMNS.flatMap((col) =>
        getProjectBoard(project.id)[col.id]
          .filter((card) => card.assignee === student.name)
          .map((card) => ({ ...card, projectId: project.id, projectName: project.name })),
      ),
    )
    .sort(
      (a, b) =>
        Number(a.column === "done") - Number(b.column === "done") ||
        (a.dueDate < b.dueDate ? -1 : 1),
    );

  const openTasks = myTasks.filter((t) => t.column !== "done");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={student.club}
        title={`Welcome back, ${student.name.split(" ")[0]}`}
        description="Here's what's due across your clubs."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Badges earned" value={String(achievements.length)} icon={Award} />
        <StatCard label="Active projects" value={String(myProjects.length)} icon={FolderKanban} />
        <StatCard label="Open tasks" value={String(openTasks.length)} icon={ListChecks} />
        <StatCard label="Upcoming events" value={String(upcomingEvents.length)} icon={CalendarDays} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Your tasks</h2>
            <Link href="/student/tasks" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          {myTasks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing assigned to you right now.</p>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {myTasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.projectName} · Due {t.dueDate}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                    {COLUMN_LABEL[t.column]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Upcoming events</h2>
            <Link href="/student/calendar" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View calendar <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {upcomingEvents.map((e) => (
              <div key={e.id}>
                <p className="text-sm font-medium">{e.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {e.location} · {e.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Your projects</h2>
          <Link href="/student/projects" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myProjects.map((p) => {
            const board = getProjectBoard(p.id);
            const total = BOARD_COLUMNS.reduce((sum, c) => sum + board[c.id].length, 0);
            const done = board.done.length;
            return (
              <Link
                key={p.id}
                href={`/student/projects/${p.id}`}
                className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <h3 className="font-display text-sm font-semibold">{p.name}</h3>
                <Progress value={total ? (done / total) * 100 : 0} className="mt-3 h-1.5" />
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent badges</h2>
          <Link href="/student/achievements" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.slice(0, 4).map((a) => {
            const def = BADGE_DEFS.find((b) => b.id === a.badgeId)!;
            return (
              <div key={a.badgeId} className="rounded-xl border border-border bg-card p-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Award className="size-4.5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-3 font-display text-sm font-semibold">{def.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.earnedAt}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

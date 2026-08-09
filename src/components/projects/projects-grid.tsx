import Link from "next/link";
import { FolderKanban, Users2 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { progressPercent } from "@/lib/board";
import type { ProjectWithTeam } from "@/lib/db/queries";

export function ProjectsGrid({
  projects,
  taskCounts,
  basePath,
  emptyTitle = "No projects yet",
  emptyDescription = "Create a project to give the club's next build a home for its team, tasks, and deadline.",
}: {
  projects: ProjectWithTeam[];
  /** Task tallies per project id. A project absent from the map has no tasks. */
  taskCounts: Map<string, { done: number; total: number }>;
  basePath: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (projects.length === 0) {
    return <EmptyState icon={FolderKanban} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => {
        const counts = taskCounts.get(p.id) ?? { done: 0, total: 0 };
        return (
          <Link
            key={p.id}
            href={`${basePath}/${p.id}`}
            className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  {p.category}
                </p>
                <h3 className="mt-1 font-display font-semibold">{p.name}</h3>
              </div>
              <StatusBadge status={p.status === "active" ? "active" : "graded"} label={p.status} />
            </div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users2 className="size-3.5" />
              {p.team.length} {p.team.length === 1 ? "student" : "students"}
              {p.leaderName ? ` · Led by ${p.leaderName}` : ""}
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {counts.total === 0 ? "No tasks yet" : `${counts.done}/${counts.total} tasks done`}
                </span>
                <span>Due {formatDate(p.due_date)}</span>
              </div>
              <Progress value={progressPercent(counts)} className="mt-1.5 h-1.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

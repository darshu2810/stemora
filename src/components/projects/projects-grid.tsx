import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import { getProjectBoard, BOARD_COLUMNS, type MockProject } from "@/lib/mock-data";

export function ProjectsGrid({ projects, basePath }: { projects: MockProject[]; basePath: string }) {
  if (projects.length === 0) {
    return <EmptyState icon={FolderKanban} title="No projects yet" description="Projects created for your clubs will show up here." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => {
        const board = getProjectBoard(p.id);
        const total = BOARD_COLUMNS.reduce((sum, c) => sum + board[c.id].length, 0);
        const done = board.done.length;
        const progress = total ? Math.round((done / total) * 100) : 0;
        return (
          <Link
            key={p.id}
            href={`${basePath}/${p.id}`}
            className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{p.clubName}</p>
                <h3 className="mt-1 font-display font-semibold">{p.name}</h3>
              </div>
              <StatusBadge status={p.status === "active" ? "active" : p.status === "completed" ? "graded" : "closed"} label={p.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{done}/{total} tasks done</span>
                <span>Due {p.dueDate}</span>
              </div>
              <Progress value={progress} className="mt-1.5 h-1.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

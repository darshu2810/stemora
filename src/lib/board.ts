import type { ProjectTask, TaskColumn, TaskPriority } from "@/lib/supabase/types";
import { initialsOf } from "@/lib/utils";

/**
 * The board's view of a task. Client components need this shape, so it lives
 * here rather than in `queries.ts` — that module is `server-only`, and importing
 * a value from it into a Client Component is a build error.
 */
export type BoardColumnId = TaskColumn;
export type BoardCardPriority = TaskPriority;

export type BoardCard = {
  id: string;
  title: string;
  assigneeId: string | null;
  assignee: string;
  assigneeInitials: string;
  dueDate: string | null;
  priority: BoardCardPriority;
  column: BoardColumnId;
};

export const BOARD_COLUMNS: { id: BoardColumnId; name: string }[] = [
  { id: "backlog", name: "Backlog" },
  { id: "todo", name: "To Do" },
  { id: "in_progress", name: "In Progress" },
  { id: "in_review", name: "In Review" },
  { id: "done", name: "Done" },
];

export const COLUMN_LABELS: Record<string, string> = Object.fromEntries(
  BOARD_COLUMNS.map((c) => [c.id, c.name]),
);

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

/**
 * A project's completion, derived from its tasks. No tasks means no progress —
 * never a flattering default.
 *
 * Lives here rather than in `queries.ts` so Client Components can call it:
 * that module is `server-only`.
 */
export function progressPercent(counts: { done: number; total: number } | undefined): number {
  if (!counts || counts.total === 0) return 0;
  return Math.round((counts.done / counts.total) * 100);
}

/** Group a project's tasks into board columns, keyed by column id. */
export function toBoardColumns(
  tasks: ProjectTask[],
  team: { id: string; name: string }[],
): Record<BoardColumnId, BoardCard[]> {
  const nameById = new Map(team.map((m) => [m.id, m.name]));
  const columns = Object.fromEntries(
    BOARD_COLUMNS.map((c) => [c.id, [] as BoardCard[]]),
  ) as Record<BoardColumnId, BoardCard[]>;

  for (const t of tasks) {
    const name = t.assignee_id ? nameById.get(t.assignee_id) ?? "" : "";
    columns[t.column_id].push({
      id: t.id,
      title: t.title,
      assigneeId: t.assignee_id,
      assignee: name || "Unassigned",
      assigneeInitials: name ? initialsOf(name) : "—",
      dueDate: t.due_date,
      priority: t.priority,
      column: t.column_id,
    });
  }

  return columns;
}

"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Trash2, Users2, CalendarDays, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { KanbanBoard } from "@/components/shared/kanban-board";
import { ActionForm, SubmitButton } from "@/components/shared/action-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { formatDate } from "@/lib/utils";
import { createTask, moveTask, deleteTask } from "@/lib/db/actions";
import {
  BOARD_COLUMNS,
  COLUMN_LABELS,
  PRIORITY_LABELS,
  toBoardColumns,
  type BoardCard,
  type BoardColumnId,
} from "@/lib/board";
import type { ProjectWithTeam } from "@/lib/db/queries";
import type { ProjectTask } from "@/lib/supabase/types";

/**
 * A project's board, backed by `project_tasks`. Every move, add, and delete is
 * a Server Action against Supabase — the board holds no task state of its own,
 * so what it shows survives a refresh.
 *
 * `team` is the project's own members: a task can only be assigned to a student
 * actually working on this build.
 */
export function ProjectBoardClient({
  project,
  tasks,
  canManage,
}: {
  project: ProjectWithTeam;
  tasks: ProjectTask[];
  canManage: boolean;
}) {
  const [addOpen, setAddOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [, startTransition] = React.useTransition();

  const team = project.team;
  const columns = React.useMemo(() => toBoardColumns(tasks, team), [tasks, team]);

  // Re-read the selected card from the revalidated data so the sheet never
  // shows a task that has since moved or been deleted.
  const selectedCard: BoardCard | null = React.useMemo(() => {
    if (!selectedId) return null;
    for (const column of BOARD_COLUMNS) {
      const found = columns[column.id].find((c) => c.id === selectedId);
      if (found) return found;
    }
    return null;
  }, [selectedId, columns]);

  const teamLabels = Object.fromEntries(team.map((m) => [m.id, m.name]));
  const total = tasks.length;
  const done = tasks.filter((t) => t.column_id === "done").length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  function runAction(
    action: typeof moveTask,
    fields: Record<string, string>,
    successMessage?: string,
  ) {
    const fd = new FormData();
    for (const [name, value] of Object.entries(fields)) fd.set(name, value);
    startTransition(async () => {
      const result = await action(undefined, fd);
      if (result.ok) {
        if (successMessage) toast.success(successMessage);
      } else {
        toast.error(result.error);
      }
    });
  }

  function moveCard(cardId: string, toColumn: BoardColumnId) {
    runAction(moveTask, { taskId: cardId, projectId: project.id, column: toColumn });
    setSelectedId(null);
  }

  function removeCard(cardId: string) {
    runAction(deleteTask, { taskId: cardId, projectId: project.id }, "Task deleted");
    setSelectedId(null);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={project.category}
        title={project.name}
        description={project.description}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status === "active" ? "active" : "graded"} label={project.status} />
            {canManage ? (
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger render={<Button><Plus className="size-4" /> Add Task</Button>} />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a task</DialogTitle>
                    <DialogDescription>
                      Assign it to a student on this project and pick where it starts.
                    </DialogDescription>
                  </DialogHeader>
                  <ActionForm action={createTask} onSuccess={() => setAddOpen(false)}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Title</Label>
                      <Input id="task-title" name="title" placeholder="Solder the new sensor mount" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-assignee">Assignee</Label>
                      {team.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          This project has no team yet. Add a student to the project first.
                        </p>
                      ) : (
                        <Select items={teamLabels} defaultValue={team[0].id} name="assigneeId">
                          <SelectTrigger id="task-assignee" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {team.map((m) => (
                              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="task-due">Due date</Label>
                        <Input id="task-due" name="dueDate" type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="task-priority">Priority</Label>
                        <Select items={PRIORITY_LABELS} defaultValue="medium" name="priority">
                          <SelectTrigger id="task-priority" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-column">Column</Label>
                      <Select items={COLUMN_LABELS} defaultValue="backlog" name="column">
                        <SelectTrigger id="task-column" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BOARD_COLUMNS.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <SubmitButton pendingLabel="Adding…">Add Task</SubmitButton>
                    </DialogFooter>
                  </ActionForm>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">Progress</span>
          <p className="mt-3 font-display text-2xl font-semibold tabular-nums">{percent}%</p>
          <Progress value={percent} className="mt-3 h-1.5" />
          <p className="mt-2 text-xs text-muted-foreground">
            {total === 0 ? "No tasks yet" : `${done} of ${total} tasks done`}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">Due date</span>
          <p className="mt-3 flex items-center gap-2 font-display text-lg font-semibold">
            <CalendarDays className="size-4 text-muted-foreground" strokeWidth={1.75} />
            {formatDate(project.due_date)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Started {formatDate(project.started_at)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
            Team · {team.length}
          </span>
          {team.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No students on this project yet.</p>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {team.map((m) => (
                  <span
                    key={m.id}
                    title={m.id === project.leader_id ? `${m.name} — project leader` : m.name}
                    className="flex items-center gap-1 rounded-full bg-secondary py-0.5 pl-0.5 pr-2 text-xs"
                  >
                    <Avatar className="size-5">
                      <AvatarFallback className="bg-primary/10 text-[0.6rem] font-medium text-primary">
                        {m.initials}
                      </AvatarFallback>
                    </Avatar>
                    {m.name.split(" ")[0]}
                    {m.id === project.leader_id ? <Star className="size-3 fill-primary text-primary" /> : null}
                  </span>
                ))}
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Users2 className="size-3" />
                {project.leaderName ? `Led by ${project.leaderName}` : "No project leader yet"}
              </p>
            </>
          )}
        </div>
      </div>

      <KanbanBoard
        columns={BOARD_COLUMNS}
        cardsByColumn={columns}
        onMove={moveCard}
        onCardClick={(card) => setSelectedId(card.id)}
      />

      <Sheet open={!!selectedCard} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent>
          {selectedCard ? (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCard.title}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assignee</span>
                  <span className="font-medium">{selectedCard.assignee}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Due date</span>
                  <span className="font-medium">
                    {selectedCard.dueDate ? formatDate(selectedCard.dueDate) : "No due date"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <span className="font-medium capitalize">{selectedCard.priority}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Move to</span>
                  <Select
                    items={COLUMN_LABELS}
                    value={selectedCard.column}
                    onValueChange={(v) => v && moveCard(selectedCard.id, v as BoardColumnId)}
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BOARD_COLUMNS.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {canManage ? (
                <SheetFooter>
                  <Button variant="destructive" className="w-full" onClick={() => removeCard(selectedCard.id)}>
                    <Trash2 className="size-4" /> Delete task
                  </Button>
                </SheetFooter>
              ) : null}
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

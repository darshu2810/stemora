"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Users2, CalendarDays, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { KanbanBoard } from "@/components/shared/kanban-board";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatDate } from "@/lib/utils";
import {
  BOARD_COLUMNS,
  type BoardCard,
  type BoardCardPriority,
  type BoardColumnId,
  type MockProject,
  type Student,
} from "@/lib/mock-data";

const taskSchema = z.object({
  title: z.string().min(2, "Enter a task title"),
  assigneeId: z.string().min(1, "Choose an assignee"),
  dueDate: z.string().min(1, "Choose a due date"),
  priority: z.custom<BoardCardPriority>(),
  column: z.custom<BoardColumnId>(),
});
type TaskValues = z.infer<typeof taskSchema>;

// Base UI renders the raw value in a Select trigger unless the root is given
// an `items` map, so every Select whose label differs from its value gets one.
const PRIORITY_LABELS: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };
const COLUMN_LABELS: Record<string, string> = Object.fromEntries(
  BOARD_COLUMNS.map((c) => [c.id, c.name]),
);

/**
 * A project's board. `team` is the project's own members — tasks can only be
 * assigned to a student actually on the project.
 */
export function ProjectBoardClient({
  project,
  initialColumns,
  team,
  canManage,
}: {
  project: MockProject;
  initialColumns: Record<BoardColumnId, BoardCard[]>;
  team: Student[];
  canManage: boolean;
}) {
  const [columns, setColumns] = React.useState(initialColumns);
  const [addOpen, setAddOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<BoardCard | null>(null);

  const form = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", assigneeId: team[0]?.id ?? "", dueDate: "", priority: "medium", column: "backlog" },
  });

  const teamLabels = Object.fromEntries(team.map((m) => [m.id, m.name]));
  const totals = BOARD_COLUMNS.reduce((sum, c) => sum + columns[c.id].length, 0);
  const done = columns.done.length;
  const percent = totals ? Math.round((done / totals) * 100) : 0;

  function moveCard(cardId: string, toColumn: BoardColumnId) {
    setColumns((prev) => {
      const next: Record<BoardColumnId, BoardCard[]> = { ...prev };
      let moved: BoardCard | undefined;
      for (const col of BOARD_COLUMNS) {
        const idx = next[col.id].findIndex((c) => c.id === cardId);
        if (idx !== -1) {
          moved = { ...next[col.id][idx], column: toColumn };
          next[col.id] = next[col.id].filter((c) => c.id !== cardId);
          break;
        }
      }
      if (moved) next[toColumn] = [...next[toColumn], moved];
      return next;
    });
    setSelectedCard(null);
  }

  function deleteCard(cardId: string) {
    setColumns((prev) => {
      const next: Record<BoardColumnId, BoardCard[]> = { ...prev };
      for (const col of BOARD_COLUMNS) {
        next[col.id] = next[col.id].filter((c) => c.id !== cardId);
      }
      return next;
    });
    setSelectedCard(null);
    toast.success("Task deleted");
  }

  function onAddTask(values: TaskValues) {
    const assignee = team.find((m) => m.id === values.assigneeId);
    setColumns((prev) => {
      const card: BoardCard = {
        id: `task_${prev[values.column].length}_${values.title.length}_${Math.random().toString(36).slice(2, 8)}`,
        title: values.title,
        assigneeId: assignee?.id ?? "",
        assignee: assignee?.name ?? "Unassigned",
        assigneeInitials: assignee?.avatarInitials ?? "—",
        dueDate: values.dueDate,
        priority: values.priority,
        column: values.column,
      };
      return { ...prev, [values.column]: [...prev[values.column], card] };
    });
    toast.success("Task added");
    form.reset();
    setAddOpen(false);
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
                    <DialogDescription>Assign it to a student on this project and pick where it starts.</DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onAddTask)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Solder the new sensor mount" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="assigneeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assignee</FormLabel>
                            <Select items={teamLabels} value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {team.map((m) => (
                                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select items={PRIORITY_LABELS} value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="column"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Column</FormLabel>
                            <Select items={COLUMN_LABELS} value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {BOARD_COLUMNS.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>Add Task</Button>
                      </DialogFooter>
                    </form>
                  </Form>
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
          <p className="mt-2 text-xs text-muted-foreground">{done} of {totals} tasks done</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">Due date</span>
          <p className="mt-3 flex items-center gap-2 font-display text-lg font-semibold">
            <CalendarDays className="size-4 text-muted-foreground" strokeWidth={1.75} />
            {formatDate(project.dueDate)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Started {formatDate(project.startedAt)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
            Team · {team.length}
          </span>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {team.map((m) => (
              <span
                key={m.id}
                title={m.id === project.leaderId ? `${m.name} — project leader` : m.name}
                className="flex items-center gap-1 rounded-full bg-secondary py-0.5 pl-0.5 pr-2 text-xs"
              >
                <Avatar className="size-5">
                  <AvatarFallback className="bg-primary/10 text-[0.6rem] font-medium text-primary">
                    {m.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                {m.name.split(" ")[0]}
                {m.id === project.leaderId ? <Star className="size-3 fill-primary text-primary" /> : null}
              </span>
            ))}
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Users2 className="size-3" /> Led by {team.find((m) => m.id === project.leaderId)?.name}
          </p>
        </div>
      </div>

      <KanbanBoard
        columns={BOARD_COLUMNS}
        cardsByColumn={columns}
        onMove={moveCard}
        onCardClick={setSelectedCard}
      />

      <Sheet open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
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
                  <span className="font-medium">{formatDate(selectedCard.dueDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <span className="font-medium capitalize">{selectedCard.priority}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Move to</span>
                  <Select items={COLUMN_LABELS} value={selectedCard.column} onValueChange={(v) => v && moveCard(selectedCard.id, v as BoardColumnId)}>
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
                  <Button variant="destructive" className="w-full" onClick={() => deleteCard(selectedCard.id)}>
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

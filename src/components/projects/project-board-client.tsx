"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { KanbanBoard } from "@/components/shared/kanban-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  BOARD_COLUMNS,
  type BoardCard,
  type BoardCardPriority,
  type BoardColumnId,
  type MockProject,
  type SchoolMember,
} from "@/lib/mock-data";

const taskSchema = z.object({
  title: z.string().min(2, "Enter a task title"),
  assigneeId: z.string().min(1, "Choose an assignee"),
  dueDate: z.string().min(1, "Choose a due date"),
  priority: z.custom<BoardCardPriority>(),
  column: z.custom<BoardColumnId>(),
});
type TaskValues = z.infer<typeof taskSchema>;

export function ProjectBoardClient({
  project,
  initialColumns,
  roster,
}: {
  project: MockProject;
  initialColumns: Record<BoardColumnId, BoardCard[]>;
  roster: SchoolMember[];
}) {
  const [columns, setColumns] = React.useState(initialColumns);
  const [addOpen, setAddOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<BoardCard | null>(null);

  const form = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", assigneeId: roster[0]?.id ?? "", dueDate: "", priority: "medium", column: "backlog" },
  });

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
    const assignee = roster.find((m) => m.id === values.assigneeId);
    setColumns((prev) => {
      const card: BoardCard = {
        id: `card_${prev[values.column].length}_${values.title.length}_${Math.random().toString(36).slice(2, 8)}`,
        title: values.title,
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
        eyebrow={project.clubName}
        title={project.name}
        description={project.description}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={project.status === "active" ? "active" : project.status === "completed" ? "graded" : "closed"} label={project.status} />
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger render={<Button><Plus className="size-4" /> Add task</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a task</DialogTitle>
                  <DialogDescription>Assign it to a club member and pick where it starts.</DialogDescription>
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
                            <Input placeholder="Solder new sensor mount" {...field} />
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
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roster.map((m) => (
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
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
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
                          <Select value={field.value} onValueChange={field.onChange}>
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
                      <Button type="submit" disabled={form.formState.isSubmitting}>Add task</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

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
                  <span className="font-medium">{selectedCard.dueDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <span className="font-medium capitalize">{selectedCard.priority}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Move to</span>
                  <Select value={selectedCard.column} onValueChange={(v) => v && moveCard(selectedCard.id, v as BoardColumnId)}>
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
              <SheetFooter>
                <Button variant="destructive" className="w-full" onClick={() => deleteCard(selectedCard.id)}>
                  <Trash2 className="size-4" /> Delete task
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

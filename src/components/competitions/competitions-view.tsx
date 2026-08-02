"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Trophy, CalendarDays, Plus, Medal, Flag, Users2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge, type StatusKind } from "@/components/shared/status-badge";
import { CategoryFilter, ALL_CATEGORIES } from "@/components/shared/category-filter";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { formatDate } from "@/lib/utils";
import {
  mockCompetitions as initialCompetitions,
  mockSchool,
  studentName,
  PROJECT_CATEGORIES,
  COMPETITION_LEVELS,
  type Competition,
  type CompetitionLevel,
  type CompetitionStatus,
  type ProjectCategory,
} from "@/lib/mock-data";

const STATUS_MAP: Record<CompetitionStatus, StatusKind> = {
  upcoming: "pending",
  completed: "graded",
};

const STATUS_FILTER_LABELS: Record<string, string> = {
  all: "All statuses",
  upcoming: "Upcoming",
  completed: "Completed",
};

const competitionSchema = z.object({
  name: z.string().min(2, "Enter a competition name"),
  category: z.custom<ProjectCategory>(),
  level: z.enum(["School", "Regional", "National", "International"]),
  date: z.string().min(1, "Choose a date"),
});
type CompetitionValues = z.infer<typeof competitionSchema>;

/**
 * The STEM Club's competition register. `canManage` gates entry creation so
 * the same view serves the read-only student surface.
 */
export function CompetitionsView({ canManage }: { canManage: boolean }) {
  const [competitions, setCompetitions] = React.useState<Competition[]>(initialCompetitions);
  const [status, setStatus] = React.useState<CompetitionStatus | "all">("all");
  const [category, setCategory] = React.useState<string>(ALL_CATEGORIES);
  const [open, setOpen] = React.useState(false);

  const form = useForm<CompetitionValues>({
    resolver: zodResolver(competitionSchema),
    defaultValues: { name: "", category: "Robotics", level: "Regional", date: "" },
  });

  function onCreate(values: CompetitionValues) {
    setCompetitions((prev) => [
      ...prev,
      {
        id: `comp_new_${prev.length}_${values.name.length}`,
        name: values.name,
        category: values.category,
        level: values.level as CompetitionLevel,
        date: values.date,
        status: "upcoming",
        podium: false,
        participantIds: [],
      },
    ]);
    toast.success(`${values.name} added to the competition register`);
    form.reset();
    setOpen(false);
  }

  const visible = competitions
    .filter((c) => status === "all" || c.status === status)
    .filter((c) => category === ALL_CATEGORIES || c.category === category)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const upcomingCount = competitions.filter((c) => c.status === "upcoming").length;
  const completedCount = competitions.filter((c) => c.status === "completed").length;
  const podiumCount = competitions.filter((c) => c.podium).length;
  const studentsEntered = new Set(competitions.flatMap((c) => c.participantIds)).size;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
        title="Competitions"
        description="Every competition the STEM Club has entered, is entering, or has placed in."
        actions={
          canManage ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button><Plus className="size-4" /> Create Competition</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a competition</DialogTitle>
                  <DialogDescription>
                    New entries start as upcoming. Add students once the roster is confirmed.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jakarta Inter-School Science Fair" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROJECT_CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
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
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Level</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COMPETITION_LEVELS.map((l) => (
                                  <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={form.formState.isSubmitting}>Create Competition</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total entries" value={String(competitions.length)} icon={Flag} />
        <StatCard label="Upcoming" value={String(upcomingCount)} icon={CalendarDays} />
        <StatCard label="Completed" value={String(completedCount)} icon={Medal} />
        <StatCard label="Students entered" value={String(studentsEntered)} icon={Users2} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          items={STATUS_FILTER_LABELS}
          value={status}
          onValueChange={(v) => setStatus((v as CompetitionStatus | "all") ?? "all")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <CategoryFilter value={category} onChange={setCategory} categories={PROJECT_CATEGORIES} />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No competitions match these filters"
          description={`${podiumCount} podium ${podiumCount === 1 ? "finish" : "finishes"} so far — clear the filters to see the full register.`}
        />
      ) : (
        <div className="space-y-3">
          {visible.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                    {c.category} · {c.level}
                  </p>
                  <h3 className="mt-1 font-display font-semibold">{c.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {c.result ? (
                    <span className="flex items-center gap-1 rounded-full bg-brand-spark/15 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium uppercase text-accent-foreground">
                      <Trophy className="size-3" /> {c.result}
                    </span>
                  ) : null}
                  <StatusBadge status={STATUS_MAP[c.status]} label={c.status} />
                </div>
              </div>
              <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="size-3" /> {formatDate(c.date)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {c.participantIds.length > 0
                  ? `Students: ${c.participantIds.map(studentName).join(", ")}`
                  : "No students confirmed on the roster yet"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

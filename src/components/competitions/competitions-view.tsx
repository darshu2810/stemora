"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Trophy, CalendarDays, Plus, Medal, Flag } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge, type StatusKind } from "@/components/shared/status-badge";
import { ClubFilter } from "@/components/shared/club-filter";
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
import {
  mockCompetitions as initialCompetitions,
  mockClubs,
  type Competition,
  type CompetitionLevel,
  type CompetitionStatus,
} from "@/lib/mock-data";

const STATUS_MAP: Record<CompetitionStatus, StatusKind> = {
  upcoming: "pending",
  ongoing: "active",
  completed: "graded",
};

const LEVELS: CompetitionLevel[] = ["School", "Regional", "National", "International"];

const STATUS_FILTER_LABELS: Record<string, string> = {
  all: "All statuses",
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

const competitionSchema = z.object({
  name: z.string().min(2, "Enter a competition name"),
  clubId: z.string().min(1, "Choose the club entering"),
  level: z.enum(["School", "Regional", "National", "International"]),
  date: z.string().min(1, "Choose a date"),
});
type CompetitionValues = z.infer<typeof competitionSchema>;

/**
 * Competition register for a school. `canManage` gates entry creation so the
 * same view can serve a read-only student surface when that nav entry is
 * re-enabled (see src/config/features.ts).
 */
export function CompetitionsView({ eyebrow, canManage }: { eyebrow: string; canManage: boolean }) {
  const [competitions, setCompetitions] = React.useState<Competition[]>(initialCompetitions);
  const [status, setStatus] = React.useState<CompetitionStatus | "all">("all");
  const [clubFilter, setClubFilter] = React.useState<string>("all");
  const [open, setOpen] = React.useState(false);

  const form = useForm<CompetitionValues>({
    resolver: zodResolver(competitionSchema),
    defaultValues: { name: "", clubId: "", level: "Regional", date: "" },
  });

  function onCreate(values: CompetitionValues) {
    const club = mockClubs.find((c) => c.id === values.clubId);
    setCompetitions((prev) => [
      ...prev,
      {
        id: `comp_new_${prev.length}_${values.name.length}`,
        name: values.name,
        club: club?.name ?? "School-wide",
        level: values.level,
        date: values.date,
        status: "upcoming",
        participants: [],
      },
    ]);
    toast.success(`${values.name} added to the competition register`);
    form.reset();
    setOpen(false);
  }

  const filterClubName = mockClubs.find((c) => c.id === clubFilter)?.name;
  const visible = competitions
    .filter((c) => status === "all" || c.status === status)
    .filter((c) => clubFilter === "all" || c.club === filterClubName)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const upcomingCount = competitions.filter((c) => c.status === "upcoming").length;
  const podiumCount = competitions.filter((c) => /1st|2nd|3rd/.test(c.result ?? "")).length;
  const studentsEntered = new Set(competitions.flatMap((c) => c.participants)).size;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={eyebrow}
        title="Competitions"
        description="Every competition your clubs have entered, are entering, or have placed in."
        actions={
          canManage ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button><Plus className="size-4" /> Add competition</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a competition</DialogTitle>
                  <DialogDescription>
                    New entries start as upcoming. Add participants once the roster is confirmed.
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
                            <Input placeholder="National Robotics Championship" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clubId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Club</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a club" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockClubs.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
                                {LEVELS.map((l) => (
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
                      <Button type="submit" disabled={form.formState.isSubmitting}>Add competition</Button>
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
        <StatCard label="Podium finishes" value={String(podiumCount)} icon={Medal} />
        <StatCard label="Students entered" value={String(studentsEntered)} icon={Trophy} />
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
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <ClubFilter value={clubFilter} onChange={setClubFilter} className="w-56" />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No competitions match these filters"
          description="Try a different status or club."
        />
      ) : (
        <div className="space-y-3">
          {visible.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                    {c.club} · {c.level}
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
                <CalendarDays className="size-3" /> {c.date}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {c.participants.length > 0 ? `Participants: ${c.participants.join(", ")}` : "No participants confirmed yet"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

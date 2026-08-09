"use client";

import * as React from "react";
import { Plus, Trophy, Flag, Medal, CalendarDays, Users2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge, type StatusKind } from "@/components/shared/status-badge";
import { CategoryFilter, ALL_CATEGORIES } from "@/components/shared/category-filter";
import { ActionForm, SubmitButton } from "@/components/shared/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatDate } from "@/lib/utils";
import { PROJECT_CATEGORIES, COMPETITION_LEVELS } from "@/config/categories";
import { createCompetition } from "@/lib/db/actions";
import type { CompetitionWithNames } from "@/lib/db/queries";
import type { CompetitionStatus } from "@/lib/supabase/types";

const STATUS_MAP: Record<CompetitionStatus, StatusKind> = {
  upcoming: "pending",
  completed: "graded",
};

const STATUS_FILTER_LABELS: Record<string, string> = {
  all: "All statuses",
  upcoming: "Upcoming",
  completed: "Completed",
};

/**
 * The STEM Club's competition register, straight from `competitions`.
 * `canManage` gates entry creation so the same view serves the read-only
 * student surface.
 */
export function CompetitionsView({
  clubName,
  competitions,
  canManage,
}: {
  clubName: string;
  competitions: CompetitionWithNames[];
  canManage: boolean;
}) {
  const [status, setStatus] = React.useState<CompetitionStatus | "all">("all");
  const [category, setCategory] = React.useState<string>(ALL_CATEGORIES);
  const [open, setOpen] = React.useState(false);

  const categoryLabels = Object.fromEntries(PROJECT_CATEGORIES.map((c) => [c, c]));
  const levelLabels = Object.fromEntries(COMPETITION_LEVELS.map((l) => [l, l]));

  const visible = competitions
    .filter((c) => status === "all" || c.status === status)
    .filter((c) => category === ALL_CATEGORIES || c.category === category);

  const upcomingCount = competitions.filter((c) => c.status === "upcoming").length;
  const completedCount = competitions.filter((c) => c.status === "completed").length;
  const studentsEntered = new Set(competitions.flatMap((c) => c.participants)).size;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={clubName}
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
                <ActionForm action={createCompetition} onSuccess={() => setOpen(false)}>
                  <div className="space-y-2">
                    <Label htmlFor="competition-name">Name</Label>
                    <Input
                      id="competition-name"
                      name="name"
                      placeholder="Inter-School Science Fair"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="competition-category">Category</Label>
                    <Select items={categoryLabels} defaultValue={PROJECT_CATEGORIES[0]} name="category">
                      <SelectTrigger id="competition-category" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="competition-level">Level</Label>
                      <Select items={levelLabels} defaultValue="Regional" name="level">
                        <SelectTrigger id="competition-level" className="w-full">
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPETITION_LEVELS.map((l) => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="competition-date">Date</Label>
                      <Input id="competition-date" name="eventDate" type="date" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <SubmitButton pendingLabel="Creating…">Create Competition</SubmitButton>
                  </DialogFooter>
                </ActionForm>
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

      {competitions.length > 0 ? (
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
      ) : null}

      {visible.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title={competitions.length === 0 ? "No competitions yet" : "No competitions match these filters"}
          description={
            competitions.length === 0
              ? canManage
                ? "Add the first competition the club is entering, and its roster."
                : "Your School Admin hasn't added any competitions yet."
              : "Try a different status or category."
          }
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
                <CalendarDays className="size-3" /> {formatDate(c.event_date)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {c.participants.length > 0
                  ? `Students: ${c.participants.join(", ")}`
                  : "No students confirmed on the roster yet"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

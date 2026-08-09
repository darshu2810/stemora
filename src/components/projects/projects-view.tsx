"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryFilter, ALL_CATEGORIES } from "@/components/shared/category-filter";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { ActionForm, SubmitButton } from "@/components/shared/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PROJECT_CATEGORIES } from "@/config/categories";
import { createProject } from "@/lib/db/actions";
import type { ProjectWithTeam, StudentRow } from "@/lib/db/queries";
import type { ProjectStatus } from "@/lib/supabase/types";

const STATUS_TABS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

/**
 * The club's projects, with the filters applied in the browser and the create
 * form going straight to Supabase. Nothing is held in local state but the
 * filters — the list itself is whatever the server just returned.
 */
export function ProjectsView({
  clubName,
  projects,
  students,
  taskCounts,
}: {
  clubName: string;
  projects: ProjectWithTeam[];
  students: StudentRow[];
  taskCounts: Map<string, { done: number; total: number }>;
}) {
  const [category, setCategory] = React.useState<string>(ALL_CATEGORIES);
  const [status, setStatus] = React.useState<ProjectStatus | "all">("all");
  const [open, setOpen] = React.useState(false);

  // Base UI needs an id -> label map to render the chosen student's name.
  const studentLabels = Object.fromEntries(students.map((s) => [s.id, s.name]));
  const categoryLabels = Object.fromEntries(PROJECT_CATEGORIES.map((c) => [c, c]));

  const visible = projects
    .filter((p) => category === ALL_CATEGORIES || p.category === category)
    .filter((p) => status === "all" || p.status === status);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={clubName}
        title="Projects"
        description="Every build the club is working on, and everything it has finished."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button><Plus className="size-4" /> Create Project</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a project</DialogTitle>
                <DialogDescription>
                  The project leader is a student on the team — a role on this project, not an account type.
                </DialogDescription>
              </DialogHeader>
              <ActionForm action={createProject} onSuccess={() => setOpen(false)}>
                <div className="space-y-2">
                  <Label htmlFor="project-name">Name</Label>
                  <Input id="project-name" name="name" placeholder="Solar Tracking System" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-category">Category</Label>
                  <Select items={categoryLabels} defaultValue={PROJECT_CATEGORIES[0]} name="category">
                    <SelectTrigger id="project-category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    name="description"
                    rows={3}
                    placeholder="What is the team building, and why?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-leader">Project leader</Label>
                    {students.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No students yet.</p>
                    ) : (
                      <Select items={studentLabels} defaultValue={students[0].id} name="leaderId">
                        <SelectTrigger id="project-leader" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-due">Due date</Label>
                    <Input id="project-due" name="dueDate" type="date" required />
                  </div>
                </div>
                <DialogFooter>
                  <SubmitButton pendingLabel="Creating…">Create Project</SubmitButton>
                </DialogFooter>
              </ActionForm>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={status} onValueChange={(v) => setStatus((v ?? "all") as ProjectStatus | "all")}>
          <TabsList>
            {STATUS_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <CategoryFilter value={category} onChange={setCategory} categories={PROJECT_CATEGORIES} />
      </div>

      <ProjectsGrid
        projects={visible}
        taskCounts={taskCounts}
        basePath="/school/projects"
        emptyTitle={projects.length === 0 ? "No projects yet" : "No projects match these filters"}
        emptyDescription={
          projects.length === 0
            ? "Create a project to give the club's next build a home for its team, tasks, and deadline."
            : "Try a different category or status."
        }
      />
    </div>
  );
}

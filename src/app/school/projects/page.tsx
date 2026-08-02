"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { CategoryFilter, ALL_CATEGORIES } from "@/components/shared/category-filter";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  mockProjects as initialProjects,
  mockStudents,
  mockSchool,
  PROJECT_CATEGORIES,
  DEMO_TODAY,
  type MockProject,
  type ProjectCategory,
  type ProjectStatus,
} from "@/lib/mock-data";

const projectSchema = z.object({
  name: z.string().min(2, "Enter a project name"),
  category: z.custom<ProjectCategory>(),
  description: z.string().min(10, "Describe what the project is building"),
  leaderId: z.string().min(1, "Choose a project leader"),
  dueDate: z.string().min(1, "Choose a due date"),
});
type ProjectValues = z.infer<typeof projectSchema>;

const STATUS_TABS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<MockProject[]>(initialProjects);
  const [category, setCategory] = React.useState<string>(ALL_CATEGORIES);
  const [status, setStatus] = React.useState<ProjectStatus | "all">("all");
  const [open, setOpen] = React.useState(false);

  const activeStudents = mockStudents.filter((s) => s.status === "active");
  // Base UI needs an id -> label map to render the chosen student's name.
  const studentLabels = Object.fromEntries(activeStudents.map((s) => [s.id, s.name]));

  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      category: "Robotics",
      description: "",
      leaderId: activeStudents[0]?.id ?? "",
      dueDate: "",
    },
  });

  const visible = projects
    .filter((p) => category === ALL_CATEGORIES || p.category === category)
    .filter((p) => status === "all" || p.status === status);

  function onCreate(values: ProjectValues) {
    setProjects((prev) => [
      {
        id: `proj_new_${prev.length}_${values.name.length}`,
        name: values.name,
        category: values.category,
        description: values.description,
        status: "active",
        startedAt: DEMO_TODAY,
        dueDate: values.dueDate,
        leaderId: values.leaderId,
        memberIds: [values.leaderId],
      },
      ...prev,
    ]);
    toast.success(`${values.name} created`);
    form.reset();
    setOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Solar Tracking System" {...field} />
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
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="What is the team building, and why?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="leaderId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project leader</FormLabel>
                          <Select items={studentLabels} value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {activeStudents.map((s) => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>Create Project</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={status} onValueChange={(v) => setStatus((v as ProjectStatus | "all") ?? "all")}>
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
        basePath="/school/projects"
        emptyTitle="No projects match these filters"
        emptyDescription="Try another category or status, or create a project for this one."
      />
    </div>
  );
}

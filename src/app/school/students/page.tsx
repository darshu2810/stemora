"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Users, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge, type StatusKind } from "@/components/shared/status-badge";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  mockStudents as initialStudents,
  mockSchool,
  projectsForStudent,
  clubStats,
  GRADES,
  DEMO_TODAY,
  type Student,
  type StudentStatus,
} from "@/lib/mock-data";

const inviteSchema = z.object({
  email: z.email("Enter a valid email"),
  grade: z.string().min(1, "Choose a grade"),
});
type InviteValues = z.infer<typeof inviteSchema>;

const STATUS_MAP: Record<StudentStatus, StatusKind> = { active: "active", invited: "pending" };

const GRADE_FILTER_LABELS: Record<string, string> = {
  all: "All grades",
  ...Object.fromEntries(GRADES.map((g) => [String(g), `Grade ${g}`])),
};

export default function StudentsPage() {
  const [students, setStudents] = React.useState<Student[]>(initialStudents);
  const [gradeFilter, setGradeFilter] = React.useState<string>("all");
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Student | null>(null);

  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", grade: "9" },
  });

  const filtered = students.filter((s) => gradeFilter === "all" || String(s.grade) === gradeFilter);
  const selectedProjects = selected ? projectsForStudent(selected.id) : [];

  const columns: DataTableColumn<Student>[] = [
    {
      key: "name",
      header: "Student",
      render: (s) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/10 text-[0.65rem] font-medium text-primary">{s.avatarInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{s.name}</p>
            <p className="text-xs text-muted-foreground">{s.email}</p>
          </div>
        </div>
      ),
    },
    { key: "grade", header: "Grade", render: (s) => `Grade ${s.grade}` },
    {
      key: "projects",
      header: "Projects",
      render: (s) => projectsForStudent(s.id).length || "—",
      className: "text-muted-foreground",
    },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={STATUS_MAP[s.status]} label={s.status} /> },
    { key: "joinedAt", header: "Joined", render: (s) => formatDate(s.joinedAt), className: "text-muted-foreground" },
  ];

  function onInvite(values: InviteValues) {
    const name = values.email.split("@")[0].replace(/[._]/g, " ");
    setStudents((prev) => [
      {
        id: `student_new_${prev.length}_${values.email.length}`,
        name,
        email: values.email,
        grade: Number(values.grade),
        status: "invited",
        joinedAt: DEMO_TODAY,
        avatarInitials: values.email.slice(0, 2).toUpperCase(),
      },
      ...prev,
    ]);
    toast.success(`Invitation sent to ${values.email}`);
    form.reset();
    setInviteOpen(false);
  }

  function removeStudent(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast.success("Student removed from the STEM Club");
    setSelected(null);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
        title="Students"
        description={`${clubStats.activeStudents} active members across Grades ${GRADES[0]}–${GRADES[GRADES.length - 1]}, and ${clubStats.pendingApplications} pending applications.`}
        actions={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger render={<Button><Plus className="size-4" /> Invite Student</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a student</DialogTitle>
                <DialogDescription>They&apos;ll get an email invite to join the {mockSchool.clubName}.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onInvite)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="name@student.gmis.sch.id" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select items={GRADE_FILTER_LABELS} value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GRADES.map((g) => (
                              <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>Invite Student</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(s) => s.id}
        searchPlaceholder="Search students…"
        searchFn={(s, q) => [s.name, s.email].some((f) => f.toLowerCase().includes(q.toLowerCase()))}
        onRowClick={(s) => setSelected(s)}
        emptyIcon={Users}
        emptyTitle="No students in this grade yet"
        emptyDescription="Choose a different grade, or invite a student to join the club."
        toolbar={
          <Select
            items={GRADE_FILTER_LABELS}
            value={gradeFilter}
            onValueChange={(v) => setGradeFilter(v ?? "all")}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              {GRADES.map((g) => (
                <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">{selected.avatarInitials}</AvatarFallback>
                  </Avatar>
                  {selected.name}
                </SheetTitle>
                <SheetDescription>{selected.email}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium">Student</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Grade</span>
                  <span className="font-medium">Grade {selected.grade}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={STATUS_MAP[selected.status]} label={selected.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium">{formatDate(selected.joinedAt)}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Projects</p>
                  {selectedProjects.length === 0 ? (
                    <p className="mt-1.5 text-sm">Not on a project yet.</p>
                  ) : (
                    <ul className="mt-1.5 space-y-1.5">
                      {selectedProjects.map((p) => (
                        <li key={p.id} className="text-sm">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-muted-foreground">
                            {p.leaderId === selected.id ? " · project leader" : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <SheetFooter>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="size-4" /> Remove from STEM Club
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove {selected.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        They&apos;ll lose access to the club workspace and be unassigned from every project task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removeStudent(selected.id)}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

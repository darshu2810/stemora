"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Archive } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { mockSchool, mockMembers } from "@/lib/mock-data";
import { SCHOOL_ROLES, ROLE_LABELS } from "@/config/roles";

const ROLE_BLURBS: Record<string, string> = {
  school_admin: "Full control of the school workspace, members, and settings.",
  student: "Joins clubs, submits work, and tracks assigned tasks.",
};

const generalSchema = z.object({
  name: z.string().min(2, "Enter a school name"),
});
type GeneralValues = z.infer<typeof generalSchema>;

export default function SchoolSettingsPage() {
  const router = useRouter();
  const form = useForm<GeneralValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: { name: mockSchool.name },
  });

  function onSave(values: GeneralValues) {
    toast.success(`Saved — school name is now "${values.name}"`);
  }

  function onArchive() {
    toast.success(`${mockSchool.name} has been archived`);
    router.push("/login");
  }

  const roleCounts = SCHOOL_ROLES.map((role) => ({
    role,
    count: mockMembers.filter((m) => m.role === role).length,
  }));

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="School" title="Settings" description="Manage your school's workspace." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Plan" value={mockSchool.plan} />
        <StatCard label="Members" value={String(mockSchool.memberCount)} />
        <StatCard label="Clubs" value={String(mockSchool.clubCount)} />
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="danger">Danger zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="max-w-md rounded-xl border border-border bg-card p-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Label className="text-muted-foreground">District</Label>
                  <p className="mt-1.5 text-sm">{mockSchool.district}</p>
                </div>
                <Button type="submit" disabled={form.formState.isSubmitting}>Save changes</Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {roleCounts.map(({ role, count }) => (
              <div key={role} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-medium">{ROLE_LABELS[role]}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{ROLE_BLURBS[role]}</p>
                </div>
                <span className="font-mono text-sm tabular-nums text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="danger" className="mt-6">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <h3 className="font-display font-semibold text-destructive">Archive this school</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Every member loses access immediately. This can be undone by STEMORA support within 30 days.
            </p>
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" className="mt-4"><Archive className="size-4" /> Archive school</Button>} />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archive {mockSchool.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All {mockSchool.memberCount} members will lose access immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onArchive}>Archive</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

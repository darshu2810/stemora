"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { mockSchool, mockUsers, clubStats } from "@/lib/mock-data";
import { SCHOOL_ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/config/roles";

const generalSchema = z.object({
  schoolName: z.string().min(2, "Enter a school name"),
  clubName: z.string().min(2, "Enter a club name"),
});
type GeneralValues = z.infer<typeof generalSchema>;

export default function SchoolSettingsPage() {
  const admin = mockUsers.school_admin;

  const form = useForm<GeneralValues>({
    resolver: zodResolver(generalSchema),
    defaultValues: { schoolName: mockSchool.name, clubName: mockSchool.clubName },
  });

  function onSave(values: GeneralValues) {
    toast.success(`Saved — the club is now "${values.clubName}"`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.name}
        title="Settings"
        description="Your school runs one STEM Club. These are its details."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Students" value={String(clubStats.students)} />
        <StatCard label="Projects" value={String(clubStats.projects)} />
        <StatCard label="Term" value={mockSchool.term.replace("Term 1 · ", "")} />
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="max-w-md rounded-xl border border-border bg-card p-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="schoolName"
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
                <FormField
                  control={form.control}
                  name="clubName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>STEM Club name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Each school has exactly one STEM Club. This is what students see across the app.
                      </FormDescription>
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

        <TabsContent value="roles" className="mt-6 space-y-6">
          <div className="max-w-md rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold">School Admin</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              One administrator runs the club. Everyone else in the workspace is a Student.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                  {admin.avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{admin.name}</p>
                <p className="text-xs text-muted-foreground">{admin.email}</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {SCHOOL_ROLES.map((role) => (
              <div key={role} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-medium">{ROLE_LABELS[role]}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
                </div>
                <span className="shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
                  {role === "school_admin" ? 1 : clubStats.students}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

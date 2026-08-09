"use client";

import { ActionForm, SubmitButton } from "@/components/shared/action-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SCHOOL_ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/config/roles";
import { updateSchool } from "@/lib/db/actions";
import { initialsOf } from "@/lib/utils";

export function SettingsView({
  schoolName,
  clubName,
  district,
  admins,
  studentCount,
}: {
  schoolName: string;
  clubName: string;
  district: string | null;
  admins: { id: string; name: string; email: string }[];
  studentCount: number;
}) {
  return (
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="mt-6">
        <div className="max-w-md rounded-xl border border-border bg-card p-5">
          <ActionForm action={updateSchool}>
            <div className="space-y-2">
              <Label htmlFor="school-name">School name</Label>
              <Input id="school-name" name="schoolName" defaultValue={schoolName} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="club-name">STEM Club name</Label>
              <Input id="club-name" name="clubName" defaultValue={clubName} required />
              <p className="text-xs text-muted-foreground">
                Each school has exactly one STEM Club. This is what students see across the app.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <Input id="district" name="district" defaultValue={district ?? ""} />
            </div>
            <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
          </ActionForm>
        </div>
      </TabsContent>

      <TabsContent value="roles" className="mt-6 space-y-6">
        <div className="max-w-md rounded-xl border border-border bg-card p-5">
          <h3 className="font-display font-semibold">School Admins</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            An administrator runs the club. Everyone else in the workspace is a Student.
          </p>
          <div className="mt-4 space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                    {initialsOf(admin.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{admin.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{admin.email}</p>
                </div>
              </div>
            ))}
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
                {role === "school_admin" ? admins.length : studentCount}
              </span>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

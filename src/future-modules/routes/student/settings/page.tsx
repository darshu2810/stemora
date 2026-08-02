"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { mockUsers, mockStudentProfiles } from "@/lib/mock-data";

const profileSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  headline: z.string().min(2, "Enter a headline"),
  location: z.string().min(2, "Enter a location"),
  about: z.string().min(5, "Write a short bio"),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: z.string().min(8, "At least 8 characters"),
    confirm: z.string().min(1, "Confirm your new password"),
  })
  .refine((v) => v.next === v.confirm, { message: "Passwords don't match", path: ["confirm"] });
type PasswordValues = z.infer<typeof passwordSchema>;

const NOTIF_PREFS = [
  { id: "grades", label: "Assignment grades", description: "When a submission is graded." },
  { id: "messages", label: "New messages", description: "Direct messages and project chats." },
  { id: "events", label: "Event reminders", description: "Upcoming club and school events." },
  { id: "achievements", label: "Achievement unlocks", description: "When you earn a new badge." },
  { id: "mentions", label: "Mentions", description: "When someone mentions you." },
];

export default function StudentSettingsPage() {
  const student = mockUsers.student;
  const profile = mockStudentProfiles[student.id];
  const [prefs, setPrefs] = React.useState<Record<string, boolean>>({
    grades: true, messages: true, events: true, achievements: true, mentions: false,
  });

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: student.name, headline: profile.headline, location: profile.location, about: profile.about },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current: "", next: "", confirm: "" },
  });

  function onSaveProfile() {
    toast.success("Profile updated");
  }

  function onUpdatePassword() {
    toast.success("Password updated");
    passwordForm.reset();
  }

  function togglePref(id: string) {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    toast.success("Notification preferences saved");
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Account" title="Settings" description="Manage your profile, notifications, and security." />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="max-w-lg space-y-6 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">{student.avatarInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{student.name}</p>
                <p className="text-xs text-muted-foreground">{student.email}</p>
              </div>
            </div>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl><Textarea rows={4} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={profileForm.formState.isSubmitting}>Save changes</Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="max-w-lg divide-y divide-border rounded-xl border border-border bg-card">
            {NOTIF_PREFS.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <Label htmlFor={p.id} className="text-sm font-medium">{p.label}</Label>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.description}</p>
                </div>
                <Switch id={p.id} checked={prefs[p.id]} onCheckedChange={() => togglePref(p.id)} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="max-w-lg space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold">Change password</h3>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)} className="mt-4 space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="current"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="next"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm new password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={passwordForm.formState.isSubmitting}>Update password</Button>
                </form>
              </Form>
            </div>

            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
              <h3 className="font-display font-semibold text-destructive">Sign out everywhere</h3>
              <p className="mt-1 text-sm text-muted-foreground">Sign out of STEMORA on all your devices.</p>
              <Button
                variant="destructive"
                className="mt-4"
                onClick={() => toast.success("Signed out of all devices")}
              >
                Sign out of all devices
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

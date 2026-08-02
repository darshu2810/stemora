"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Mail,
  Link2,
  Globe,
  MapPin,
  Plus,
  X,
  Award,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  mockUsers,
  mockStudentProfiles,
  mockStudentSkills,
  mockStudentCertificates,
  mockStudentLeadership,
  mockStudentAchievements,
  BADGE_DEFS,
  type Skill,
} from "@/lib/mock-data";

const skillSchema = z.object({
  name: z.string().min(2, "Enter a skill name"),
  category: z.string().min(2, "Enter a category"),
  level: z.string(),
});
type SkillValues = z.infer<typeof skillSchema>;

export default function StudentProfilePage() {
  const student = mockUsers.student;
  const profile = mockStudentProfiles[student.id];
  const [skills, setSkills] = React.useState<Skill[]>(mockStudentSkills[student.id] ?? []);
  const [open, setOpen] = React.useState(false);
  const certificates = mockStudentCertificates[student.id] ?? [];
  const leadership = mockStudentLeadership[student.id] ?? [];
  const achievements = mockStudentAchievements[student.id] ?? [];

  const form = useForm<SkillValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", category: "", level: "3" },
  });

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  function addSkill(values: SkillValues) {
    setSkills((prev) => [...prev, { name: values.name, category: values.category, level: Number(values.level) }]);
    toast.success(`${values.name} added to your skills`);
    form.reset();
    setOpen(false);
  }

  function removeSkill(name: string) {
    setSkills((prev) => prev.filter((s) => s.name !== name));
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-28 bg-gradient-to-br from-primary to-brand-spark" />
        <div className="px-6 pb-6">
          <div className="-mt-10">
            <Avatar className="size-20 border-4 border-card">
              <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">{student.avatarInitials}</AvatarFallback>
            </Avatar>
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold">{student.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{profile.headline}</p>
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> {profile.location}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={`mailto:${profile.links.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <Mail className="size-4" /> Email
            </a>
            {profile.links.github ? (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Link2 className="size-4" /> {profile.links.github}
              </span>
            ) : null}
            {profile.links.linkedin ? (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Link2 className="size-4" /> {profile.links.linkedin}
              </span>
            ) : null}
            {profile.links.website ? (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Globe className="size-4" /> {profile.links.website}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{profile.about}</p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Skills</h2>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger render={<Button variant="outline" size="sm"><Plus className="size-3.5" /> Add skill</Button>} />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a skill</DialogTitle>
                    <DialogDescription>Shows up here and on your public portfolio.</DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(addSkill)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skill</FormLabel>
                            <FormControl>
                              <Input placeholder="ROS2" {...field} />
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
                            <FormControl>
                              <Input placeholder="Programming" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proficiency</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">Beginner</SelectItem>
                                <SelectItem value="2">Developing</SelectItem>
                                <SelectItem value="3">Competent</SelectItem>
                                <SelectItem value="4">Advanced</SelectItem>
                                <SelectItem value="5">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>Add skill</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 space-y-4">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category}>
                  <h3 className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{category}</h3>
                  <div className="mt-2 space-y-2">
                    {items.map((s) => (
                      <div key={s.name} className="group flex items-center gap-3">
                        <span className="w-36 shrink-0 text-sm">{s.name}</span>
                        <div className="flex flex-1 gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={cn("h-1.5 flex-1 rounded-full", i < s.level ? "bg-primary" : "bg-muted")}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => removeSkill(s.name)}
                          aria-label={`Remove ${s.name}`}
                          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Leadership roles</h2>
            <div className="mt-4 space-y-5">
              {leadership.map((role) => (
                <div key={role.id} className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="size-4.5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{role.title}</p>
                    <p className="text-xs text-muted-foreground">{role.org} · {role.period}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Badges</h2>
              <Link href="/student/achievements" className="text-xs font-medium text-primary hover:underline">View all</Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {achievements.map((a) => {
                const def = BADGE_DEFS.find((b) => b.id === a.badgeId)!;
                return (
                  <span key={a.badgeId} className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <Award className="size-3.5" /> {def.name}
                  </span>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Certificates</h2>
            <div className="mt-3 space-y-3">
              {certificates.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.issuer} · {c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

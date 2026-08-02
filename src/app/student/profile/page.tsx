"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Plus, X, Award, FolderKanban, GraduationCap, Star } from "lucide-react";
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
import { cn, formatDate } from "@/lib/utils";
import {
  mockSchool,
  mockUsers,
  mockProfiles,
  mockSkills,
  mockCertificates,
  mockAchievements,
  projectsForStudent,
  studentById,
  BADGE_DEFS,
  type Skill,
} from "@/lib/mock-data";

// Base UI renders the raw value in a Select trigger unless the root is given
// an `items` map, so every Select whose label differs from its value gets one.
const PROFICIENCY_LABELS: Record<string, string> = {
  "1": "Beginner",
  "2": "Developing",
  "3": "Competent",
  "4": "Advanced",
  "5": "Expert",
};

const skillSchema = z.object({
  name: z.string().min(2, "Enter a skill name"),
  category: z.string().min(2, "Enter a category"),
  level: z.string(),
});
type SkillValues = z.infer<typeof skillSchema>;

export default function StudentProfilePage() {
  const student = mockUsers.student;
  const record = studentById(student.id);
  const profile = mockProfiles[student.id];
  const [skills, setSkills] = React.useState<Skill[]>(mockSkills[student.id] ?? []);
  const [open, setOpen] = React.useState(false);
  const certificates = mockCertificates[student.id] ?? [];
  const achievements = mockAchievements[student.id] ?? [];
  const projects = projectsForStudent(student.id);

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
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {profile.location}</span>
            {record ? <span>Joined the club {formatDate(record.joinedAt)}</span> : null}
          </div>
          <div className="mt-4">
            <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <Mail className="size-4" /> {profile.email}
            </a>
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
                    <DialogDescription>Shows up on your STEM Club profile.</DialogDescription>
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
                              <Input placeholder="3D printing" {...field} />
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
                              <Input placeholder="Hardware" {...field} />
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
                            <Select items={PROFICIENCY_LABELS} value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(PROFICIENCY_LABELS).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>{label}</SelectItem>
                                ))}
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
            <h2 className="font-display font-semibold">Projects</h2>
            <div className="mt-4 space-y-4">
              {projects.map((p) => (
                <Link key={p.id} href={`/student/projects/${p.id}`} className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderKanban className="size-4.5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium">
                      {p.name}
                      {p.leaderId === student.id ? (
                        <span className="flex items-center gap-0.5 text-xs font-normal text-primary">
                          <Star className="size-3 fill-primary" /> Project leader
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.category} · started {formatDate(p.startedAt)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Achievements</h2>
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
                    <p className="text-xs text-muted-foreground">{c.issuer} · {formatDate(c.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Club</h2>
            <p className="mt-2 text-sm">{mockSchool.clubName}</p>
            <p className="text-xs text-muted-foreground">{mockSchool.name} · {mockSchool.district}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

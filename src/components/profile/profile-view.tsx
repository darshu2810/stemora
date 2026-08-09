"use client";

import * as React from "react";
import Link from "next/link";
import {
  Award,
  FolderKanban,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Star,
  X,
} from "lucide-react";
import { ActionForm, SubmitButton, ActionButton } from "@/components/shared/action-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn, formatDate, initialsOf } from "@/lib/utils";
import { saveProfile, addSkill, removeSkill, addCertificate } from "@/lib/db/actions";
import type { AchievementWithBadge, ProjectWithTeam } from "@/lib/db/queries";
import type {
  StudentCertificate,
  StudentProfile,
  StudentSkill,
} from "@/lib/supabase/types";

const PROFICIENCY_LABELS: Record<string, string> = {
  "1": "Beginner",
  "2": "Learning",
  "3": "Competent",
  "4": "Strong",
  "5": "Expert",
};

type SessionSlice = {
  userId: string;
  fullName: string;
  email: string;
  clubName: string | null;
  schoolName: string | null;
  district: string | null;
};

/**
 * The student's own profile. Everything here is theirs to edit, and every edit
 * is a Server Action — nothing is kept in local state, so what the page shows
 * is what the database holds.
 */
export function ProfileView({
  session,
  profile,
  skills,
  certificates,
  achievements,
  projects,
}: {
  session: SessionSlice;
  profile: StudentProfile | null;
  skills: StudentSkill[];
  certificates: StudentCertificate[];
  achievements: AchievementWithBadge[];
  projects: ProjectWithTeam[];
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [skillOpen, setSkillOpen] = React.useState(false);
  const [certOpen, setCertOpen] = React.useState(false);

  const skillsByCategory = skills.reduce<Record<string, StudentSkill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-28 bg-gradient-to-br from-primary to-brand-spark" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end justify-between gap-4">
            <Avatar className="size-20 border-4 border-card">
              <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                {initialsOf(session.fullName)}
              </AvatarFallback>
            </Avatar>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" size="sm">
                    <Pencil className="size-3.5" /> Edit profile
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit your profile</DialogTitle>
                  <DialogDescription>This is what the rest of the club sees.</DialogDescription>
                </DialogHeader>
                <ActionForm action={saveProfile} onSuccess={() => setEditOpen(false)}>
                  <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      name="headline"
                      defaultValue={profile?.headline ?? ""}
                      placeholder="Robotics and embedded systems"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" defaultValue={profile?.location ?? ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about">About</Label>
                    <Textarea id="about" name="about" rows={4} defaultValue={profile?.about ?? ""} />
                  </div>
                  <DialogFooter>
                    <SubmitButton>Save profile</SubmitButton>
                  </DialogFooter>
                </ActionForm>
              </DialogContent>
            </Dialog>
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold">{session.fullName}</h1>
          {profile?.headline ? (
            <p className="mt-1 text-sm text-muted-foreground">{profile.headline}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">No headline yet.</p>
          )}
          {profile?.location ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {profile.location}
              </span>
            </div>
          ) : null}
          <div className="mt-4">
            <a
              href={`mailto:${session.email}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="size-4" /> {session.email}
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {profile?.about ?? "Nothing here yet — use Edit profile to introduce yourself."}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Skills</h2>
              <Dialog open={skillOpen} onOpenChange={setSkillOpen}>
                <DialogTrigger
                  render={
                    <Button variant="outline" size="sm">
                      <Plus className="size-3.5" /> Add skill
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a skill</DialogTitle>
                    <DialogDescription>Shows up on your STEM Club profile.</DialogDescription>
                  </DialogHeader>
                  <ActionForm action={addSkill} onSuccess={() => setSkillOpen(false)}>
                    <div className="space-y-2">
                      <Label htmlFor="skill-name">Skill</Label>
                      <Input id="skill-name" name="name" placeholder="3D printing" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skill-category">Category</Label>
                      <Input id="skill-category" name="category" placeholder="Hardware" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skill-level">Proficiency</Label>
                      <Select items={PROFICIENCY_LABELS} defaultValue="3" name="level">
                        <SelectTrigger id="skill-level" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROFICIENCY_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <SubmitButton>Add skill</SubmitButton>
                    </DialogFooter>
                  </ActionForm>
                </DialogContent>
              </Dialog>
            </div>
            {skills.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No skills added yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      {category}
                    </h3>
                    <div className="mt-2 space-y-2">
                      {items.map((s) => (
                        <div key={s.id} className="group flex items-center gap-3">
                          <span className="w-36 shrink-0 text-sm">{s.name}</span>
                          <div className="flex flex-1 gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "h-1.5 flex-1 rounded-full",
                                  i < s.level ? "bg-primary" : "bg-muted",
                                )}
                              />
                            ))}
                          </div>
                          <ActionButton
                            action={removeSkill}
                            fields={{ skillId: s.id }}
                            size="icon"
                            className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                            ariaLabel={`Remove ${s.name}`}
                          >
                            <X className="size-3.5" />
                          </ActionButton>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Projects</h2>
            {projects.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">You&apos;re not on a project yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {projects.map((p) => (
                  <Link key={p.id} href={`/student/projects/${p.id}`} className="flex gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FolderKanban className="size-4.5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-medium">
                        {p.name}
                        {p.leader_id === session.userId ? (
                          <span className="flex items-center gap-0.5 text-xs font-normal text-primary">
                            <Star className="size-3 fill-primary" /> Project leader
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.category} · started {formatDate(p.started_at)}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Achievements</h2>
              <Link href="/student/achievements" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            {achievements.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No awards yet.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {achievements.map((a) => (
                  <span
                    key={a.id}
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    <Award className="size-3.5" /> {a.badgeName}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Certificates</h2>
              <Dialog open={certOpen} onOpenChange={setCertOpen}>
                <DialogTrigger
                  render={
                    <Button variant="ghost" size="icon" className="size-7" aria-label="Add certificate">
                      <Plus className="size-3.5" />
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a certificate</DialogTitle>
                    <DialogDescription>Something you earned outside the club counts too.</DialogDescription>
                  </DialogHeader>
                  <ActionForm action={addCertificate} onSuccess={() => setCertOpen(false)}>
                    <div className="space-y-2">
                      <Label htmlFor="cert-title">Title</Label>
                      <Input id="cert-title" name="title" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cert-issuer">Issuer</Label>
                      <Input id="cert-issuer" name="issuer" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cert-date">Issued on</Label>
                      <Input id="cert-date" name="issuedOn" type="date" required />
                    </div>
                    <DialogFooter>
                      <SubmitButton>Add certificate</SubmitButton>
                    </DialogFooter>
                  </ActionForm>
                </DialogContent>
              </Dialog>
            </div>
            {certificates.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No certificates yet.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {certificates.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <GraduationCap className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.issuer} · {formatDate(c.issued_on)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display font-semibold">Club</h2>
            <p className="mt-2 text-sm">{session.clubName ?? "STEM Club"}</p>
            <p className="text-xs text-muted-foreground">
              {session.schoolName}
              {session.district ? ` · ${session.district}` : ""}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Link2,
  Globe,
  MapPin,
  Download,
  Award,
  ShieldCheck,
  GraduationCap,
  Trophy,
  Lightbulb,
  Users2,
  FlaskConical,
  Code2,
  Cog,
  FolderKanban,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { FollowButton } from "@/components/community/follow-button";
import { mockGlobalStudents, mockGlobalSchools } from "@/lib/mock-global";
import {
  getPublicProfileByHandle,
  mockStudentSkills,
  mockStudentCertificates,
  mockStudentLeadership,
  mockStudentAchievements,
  mockCompetitions,
  mockProjects,
  BADGE_DEFS,
  type BadgeId,
} from "@/lib/mock-data";

const BADGE_ICONS: Record<BadgeId, LucideIcon> = {
  innovator: Lightbulb,
  team_leader: Users2,
  researcher: FlaskConical,
  programmer: Code2,
  engineer: Cog,
  champion: Trophy,
  volunteer: HeartHandshake,
};

const PROJECT_COVERS = [
  "from-primary to-brand-spark",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-purple-500",
  "from-amber-500 to-orange-500",
];

export default function PublicPortfolioPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const result = getPublicProfileByHandle(handle);
  if (!result) notFound();
  const { profile, member } = result;

  const skills = mockStudentSkills[member.id] ?? [];
  const certificates = mockStudentCertificates[member.id] ?? [];
  const leadership = mockStudentLeadership[member.id] ?? [];
  const achievements = mockStudentAchievements[member.id] ?? [];
  const projects = mockProjects.filter((p) => p.clubName === member.club);
  const competitions = mockCompetitions.filter((c) => c.participants.includes(member.name));
  const globalStudent = mockGlobalStudents.find((s) => s.handle === handle);
  const school = mockGlobalSchools.find((s) => s.name === globalStudent?.school);
  const competitionsWon = competitions.filter((c) => c.result?.includes("1st")).length;

  const activity = [
    ...projects.slice(0, 2).map((p) => ({ id: `act_p_${p.id}`, text: `Contributed to ${p.name}`, meta: p.clubName })),
    ...achievements.slice(0, 2).map((a) => {
      const def = BADGE_DEFS.find((b) => b.id === a.badgeId)!;
      return { id: `act_a_${a.badgeId}`, text: `Earned the ${def.name} badge`, meta: a.earnedAt };
    }),
    ...competitions.slice(0, 2).map((c) => ({ id: `act_c_${c.id}`, text: `Competed in ${c.name}`, meta: c.result ?? c.date })),
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-6 py-12">
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-28 bg-gradient-to-br from-primary to-brand-spark" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <Avatar className="size-24 border-4 border-card">
              <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">{member.avatarInitials}</AvatarFallback>
            </Avatar>
            <FollowButton id={`student:${handle}`} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">{member.name}</h1>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground">{profile.headline}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {profile.location}</span>
            {school ? (
              <Link href={`/schools/${school.slug}`} className="hover:text-foreground hover:underline">{school.name}</Link>
            ) : null}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href={`mailto:${profile.links.email}`} className="flex items-center gap-1.5 hover:text-foreground">
              <Mail className="size-4" /> Email
            </a>
            {profile.links.github ? (
              <span className="flex items-center gap-1.5">
                <Link2 className="size-4" /> {profile.links.github}
              </span>
            ) : null}
            {profile.links.website ? (
              <span className="flex items-center gap-1.5">
                <Globe className="size-4" /> {profile.links.website}
              </span>
            ) : null}
          </div>
          <Button
            className="mt-5"
            variant="outline"
            onClick={() => toast.info("Resume download isn't available in preview mode yet.")}
          >
            <Download className="size-4" /> Download resume
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Followers" value={String(globalStudent?.followers ?? 0)} icon={Users2} />
        <StatCard label="Projects" value={String(projects.length)} icon={FolderKanban} />
        <StatCard label="Badges" value={String(achievements.length)} icon={Award} />
        <StatCard label="1st place wins" value={String(competitionsWon)} icon={Trophy} />
      </section>

      <section>
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">About</h2>
        <p className="mt-2 text-sm leading-relaxed">{profile.about}</p>
      </section>

      {skills.length > 0 ? (
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.name} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {projects.length > 0 ? (
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Featured work</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {projects.map((p, i) => (
              <div key={p.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <div className={`h-20 bg-gradient-to-br ${PROJECT_COVERS[i % PROJECT_COVERS.length]}`} />
                <div className="p-4">
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">{p.clubName}</p>
                  <h3 className="mt-1 font-display text-sm font-semibold">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {achievements.length > 0 ? (
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Achievements</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {achievements.map((a) => {
              const def = BADGE_DEFS.find((b) => b.id === a.badgeId)!;
              const Icon = BADGE_ICONS[a.badgeId];
              return (
                <div key={a.badgeId} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-4.5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{def.name}</p>
                    <p className="text-xs text-muted-foreground">{a.note ?? def.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {certificates.length > 0 ? (
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Certificates</h2>
          <div className="mt-3 space-y-2">
            {certificates.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <GraduationCap className="size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.issuer} · {c.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {competitions.length > 0 ? (
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Competition history</h2>
          <div className="mt-3 space-y-2 border-l border-border pl-4">
            {competitions.map((c) => (
              <div key={c.id} className="relative pb-2">
                <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.level} · {c.date} {c.result ? `· ${c.result}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {leadership.length > 0 ? (
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Leadership roles</h2>
          <div className="mt-3 space-y-4">
            {leadership.map((role) => (
              <div key={role.id} className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{role.title} · {role.org}</p>
                  <p className="text-xs text-muted-foreground">{role.period}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {activity.length > 0 ? (
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Recent activity</h2>
          <div className="mt-3 space-y-2 border-l border-border pl-4">
            {activity.map((a) => (
              <div key={a.id} className="relative pb-2">
                <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-brand-spark" />
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.meta}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-6 text-center">
        <Award className="size-4 text-primary" />
        <p className="text-sm text-muted-foreground">
          Want to reach out? <a href={`mailto:${profile.links.email}`} className="font-medium text-primary hover:underline">{profile.links.email}</a>
        </p>
      </section>
    </div>
  );
}

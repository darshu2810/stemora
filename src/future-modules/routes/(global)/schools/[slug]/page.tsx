import { notFound } from "next/navigation";
import { MapPin, Users2, LayoutGrid, FolderKanban, Trophy, GraduationCap } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { FollowButton } from "@/components/community/follow-button";
import { ProjectCard } from "@/components/global/project-card";
import { StudentCard } from "@/components/global/student-card";
import { mockGlobalSchools, mockShowcaseProjects, mockGlobalStudents } from "@/lib/mock-global";

export default async function PublicSchoolProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = mockGlobalSchools.find((s) => s.slug === slug);
  if (!school) notFound();

  const featuredProjects = mockShowcaseProjects.filter((p) => p.school === school.name).slice(0, 4);
  const featuredStudents = mockGlobalStudents.filter((s) => s.school === school.name).slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className={`h-32 bg-gradient-to-br ${school.cover}`} />
        <div className="px-6 pb-6">
          <div className="-mt-8 flex items-end justify-between">
            <div className="flex size-16 items-center justify-center rounded-xl border-4 border-card bg-secondary font-display text-lg font-semibold">
              {school.name.slice(0, 2).toUpperCase()}
            </div>
            <FollowButton id={`school:${school.id}`} />
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold">{school.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {school.city}, {school.country} · {school.curriculum} · Founded {school.founded}
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{school.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {school.categories.map((c) => (
              <span key={c} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students" value={school.stats.students.toLocaleString()} icon={Users2} />
        <StatCard label="Clubs" value={String(school.stats.clubs)} icon={LayoutGrid} />
        <StatCard label="Projects" value={String(school.stats.projects)} icon={FolderKanban} />
        <StatCard label="Competitions won" value={String(school.stats.competitionsWon)} icon={Trophy} />
      </div>

      {featuredProjects.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display font-semibold">Featured projects</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      ) : null}

      {featuredStudents.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display font-semibold">Featured students</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredStudents.map((s) => <StudentCard key={s.id} student={s} />)}
          </div>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-display font-semibold">Gallery</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: school.galleryCount }, (_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg bg-gradient-to-br ${school.cover} ${i % 2 === 0 ? "opacity-100" : "opacity-70"}`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display font-semibold">Achievements</h2>
        <div className="space-y-2">
          {school.achievements.map((a) => (
            <div key={a} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <GraduationCap className="size-4 shrink-0 text-primary" />
              <p className="text-sm">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

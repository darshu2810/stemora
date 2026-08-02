import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SchoolCard } from "@/components/global/school-card";
import { ProjectCard } from "@/components/global/project-card";
import { StudentCard } from "@/components/global/student-card";
import { CompetitionCard } from "@/components/global/competition-card";
import { ResearchCard } from "@/components/global/research-card";
import {
  mockGlobalSchools,
  mockShowcaseProjects,
  mockGlobalStudents,
  mockGlobalCompetitions,
  mockResearchItems,
} from "@/lib/mock-global";

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <Link href={href} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        View all <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}

export default function DiscoverPage() {
  const trendingProjects = [...mockShowcaseProjects].sort((a, b) => b.likes - a.likes).slice(0, 4);
  const featuredSchools = [...mockGlobalSchools].sort((a, b) => b.stats.competitionsWon - a.stats.competitionsWon).slice(0, 4);
  const featuredStudents = [...mockGlobalStudents].sort((a, b) => b.followers - a.followers).slice(0, 4);
  const featuredCompetitions = mockGlobalCompetitions.filter((c) => c.registration !== "closed").slice(0, 3);
  const recentResearch = [...mockResearchItems].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="STEMORA Network"
        title="Discover"
        description="Trending builds, standout schools, and rising students from across the global STEM network."
      />

      <section className="space-y-4">
        <SectionHeader title="Trending projects" href="/projects" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Featured schools" href="/schools" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSchools.map((s) => (
            <SchoolCard key={s.id} school={s} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Featured students" href="/students" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredStudents.map((s) => (
            <StudentCard key={s.id} student={s} />
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <SectionHeader title="Featured competitions" href="/competitions" />
          <div className="space-y-3">
            {featuredCompetitions.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Recent research" href="/research" />
          <div className="space-y-3">
            {recentResearch.map((r) => (
              <ResearchCard key={r.id} item={r} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

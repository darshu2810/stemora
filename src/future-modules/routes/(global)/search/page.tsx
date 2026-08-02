"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolCard } from "@/components/global/school-card";
import { ProjectCard } from "@/components/global/project-card";
import { StudentCard } from "@/components/global/student-card";
import { ResearchCard } from "@/components/global/research-card";
import { CompetitionCard } from "@/components/global/competition-card";
import { EventCard } from "@/components/global/event-card";
import {
  mockGlobalSchools,
  mockShowcaseProjects,
  mockGlobalStudents,
  mockResearchItems,
  mockGlobalCompetitions,
  mockGlobalEvents,
} from "@/lib/mock-global";

type Category = "all" | "schools" | "students" | "projects" | "research" | "competitions" | "events";

export default function SearchPage() {
  return (
    <React.Suspense fallback={null}>
      <SearchPageContent />
    </React.Suspense>
  );
}

function SearchPageContent() {
  const params = useSearchParams();
  const [query, setQuery] = React.useState(params.get("q") ?? "");
  const [category, setCategory] = React.useState<Category>("all");

  const q = query.toLowerCase().trim();
  const matches = (...fields: string[]) => !q || fields.some((f) => f.toLowerCase().includes(q));

  const schools = mockGlobalSchools.filter((s) => matches(s.name, s.city, s.country, ...s.categories));
  const students = mockGlobalStudents.filter((s) => matches(s.name, s.school, ...s.skills, ...s.interests));
  const projects = mockShowcaseProjects.filter((p) => matches(p.title, p.school, p.category, ...p.technologies));
  const research = mockResearchItems.filter((r) => matches(r.title, r.school, r.category, ...r.authors));
  const competitions = mockGlobalCompetitions.filter((c) => matches(c.name, c.category, c.country));
  const events = mockGlobalEvents.filter((e) => matches(e.title, e.type, e.location));

  const totalResults =
    schools.length + students.length + projects.length + research.length + competitions.length + events.length;

  const showSection = (c: Category) => category === "all" || category === c;

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="STEMORA Network" title="Search" description={q ? `${totalResults} results for "${query}"` : "Search schools, students, projects, research, and more."} />

      <div className="relative max-w-lg">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the network…" className="pl-9" />
      </div>

      <Tabs value={category} onValueChange={(v) => v && setCategory(v as Category)}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
      </Tabs>

      {totalResults === 0 ? (
        <EmptyState icon={SearchIcon} title="No results" description="Try a different search term or category." />
      ) : (
        <div className="space-y-10">
          {showSection("schools") && schools.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display font-semibold">Schools</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {schools.map((s) => <SchoolCard key={s.id} school={s} />)}
              </div>
            </section>
          ) : null}

          {showSection("students") && students.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display font-semibold">Students</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {students.map((s) => <StudentCard key={s.id} student={s} />)}
              </div>
            </section>
          ) : null}

          {showSection("projects") && projects.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display font-semibold">Projects</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            </section>
          ) : null}

          {showSection("research") && research.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display font-semibold">Research</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {research.map((r) => <ResearchCard key={r.id} item={r} />)}
              </div>
            </section>
          ) : null}

          {showSection("competitions") && competitions.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display font-semibold">Competitions</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {competitions.map((c) => <CompetitionCard key={c.id} competition={c} />)}
              </div>
            </section>
          ) : null}

          {showSection("events") && events.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-display font-semibold">Events</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {events.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ClubFilter } from "@/components/shared/club-filter";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { mockProjects } from "@/lib/mock-data";

export default function ProjectsPage() {
  const [clubFilter, setClubFilter] = React.useState("all");

  const projects = mockProjects.filter((p) => clubFilter === "all" || p.clubId === clubFilter);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="School"
        title="Projects"
        description="Every build in progress, across every club."
        actions={
          <ClubFilter value={clubFilter} onChange={setClubFilter} />
        }
      />

      <ProjectsGrid projects={projects} basePath="/school/projects" />
    </div>
  );
}

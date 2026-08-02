"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { useMockSession } from "@/lib/mock-session";
import { mockProjects } from "@/lib/mock-data";

export default function StudentProjectsPage() {
  const { user } = useMockSession();
  const projects = mockProjects.filter((p) => p.clubName === user.club);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow={user.club ?? "My clubs"} title="My projects" description="Every build you're part of." />
      <ProjectsGrid projects={projects} basePath="/student/projects" />
    </div>
  );
}

import { PageHeader } from "@/components/shared/page-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { mockSchool, mockUsers, projectsForStudent } from "@/lib/mock-data";

export default function StudentProjectsPage() {
  const student = mockUsers.student;
  const projects = projectsForStudent(student.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
        title="My Projects"
        description={`The ${projects.length} ${projects.length === 1 ? "project" : "projects"} you're on this term.`}
      />
      <ProjectsGrid
        projects={projects}
        basePath="/student/projects"
        emptyTitle="You're not on a project yet"
        emptyDescription="Ask your School Admin to add you to a project team, and it will show up here."
      />
    </div>
  );
}

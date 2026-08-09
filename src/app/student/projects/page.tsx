import { PageHeader } from "@/components/shared/page-header";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { requireStudent } from "@/lib/auth/session";
import { projectsForStudent, taskCountsByProject } from "@/lib/db/queries";

export default async function StudentProjectsPage() {
  const session = await requireStudent();
  const [projects, taskCounts] = await Promise.all([
    projectsForStudent(session.schoolId, session.userId),
    taskCountsByProject(session.schoolId),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={session.clubName ?? "STEM Club"}
        title="My Projects"
        description={
          projects.length === 0
            ? "You're not on a project yet."
            : `The ${projects.length} ${projects.length === 1 ? "project" : "projects"} you're on.`
        }
      />
      <ProjectsGrid
        projects={projects}
        taskCounts={taskCounts}
        basePath="/student/projects"
        emptyTitle="You're not on a project yet"
        emptyDescription="Ask your School Admin to add you to a project team, and it will show up here."
      />
    </div>
  );
}

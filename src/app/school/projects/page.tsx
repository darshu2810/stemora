import { ProjectsView } from "@/components/projects/projects-view";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { listProjects, listStudents, taskCountsByProject } from "@/lib/db/queries";

export default async function ProjectsPage() {
  const session = await requireSchoolAdmin();

  const [projects, students, taskCounts] = await Promise.all([
    listProjects(session.schoolId),
    listStudents(session.schoolId),
    taskCountsByProject(session.schoolId),
  ]);

  return (
    <ProjectsView
      clubName={session.clubName ?? "STEM Club"}
      projects={projects}
      students={students}
      taskCounts={taskCounts}
    />
  );
}

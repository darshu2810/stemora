import { notFound } from "next/navigation";
import { ProjectBoardClient } from "@/components/projects/project-board-client";
import { requireStudent } from "@/lib/auth/session";
import { getProject, listProjectTasks } from "@/lib/db/queries";

export default async function StudentProjectBoardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await requireStudent();

  // Scoped to the student's own school, so a project id from another school
  // is a 404 rather than a leak — RLS enforces the same thing underneath.
  const project = await getProject(session.schoolId, projectId);
  if (!project) notFound();

  const tasks = await listProjectTasks(project.id);

  // Students move their own tasks across the board but don't add or delete
  // them — that stays with the School Admin.
  return <ProjectBoardClient project={project} tasks={tasks} canManage={false} />;
}

import { notFound } from "next/navigation";
import { ProjectBoardClient } from "@/components/projects/project-board-client";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { getProject, listProjectTasks } from "@/lib/db/queries";

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await requireSchoolAdmin();

  const project = await getProject(session.schoolId, projectId);
  if (!project) notFound();

  const tasks = await listProjectTasks(project.id);

  return <ProjectBoardClient project={project} tasks={tasks} canManage />;
}

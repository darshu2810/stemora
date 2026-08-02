import { notFound } from "next/navigation";
import { projectById, mockStudents, getProjectBoard } from "@/lib/mock-data";
import { ProjectBoardClient } from "@/components/projects/project-board-client";

export default async function StudentProjectBoardPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = projectById(projectId);
  if (!project) notFound();

  const team = project.memberIds
    .map((id) => mockStudents.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  // Students move their own tasks across the board but don't add or delete
  // them — that stays with the School Admin.
  return (
    <ProjectBoardClient
      project={project}
      initialColumns={getProjectBoard(project.id)}
      team={team}
      canManage={false}
    />
  );
}

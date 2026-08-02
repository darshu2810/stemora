import { notFound } from "next/navigation";
import { projectById, mockStudents, getProjectBoard } from "@/lib/mock-data";
import { ProjectBoardClient } from "@/components/projects/project-board-client";

export default async function ProjectBoardPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = projectById(projectId);
  if (!project) notFound();

  // The team is the project's own members — tasks are only ever assigned to a
  // student actually working on this build.
  const team = project.memberIds
    .map((id) => mockStudents.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <ProjectBoardClient
      project={project}
      initialColumns={getProjectBoard(project.id)}
      team={team}
      canManage
    />
  );
}

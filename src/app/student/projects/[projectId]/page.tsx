import { notFound } from "next/navigation";
import { mockProjects, mockMembers, getProjectBoard } from "@/lib/mock-data";
import { ProjectBoardClient } from "@/components/projects/project-board-client";

export default async function StudentProjectBoardPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = mockProjects.find((p) => p.id === projectId);
  if (!project) notFound();

  const roster = mockMembers.filter((m) => m.clubId === project.clubId);
  const board = getProjectBoard(project.id);

  return <ProjectBoardClient project={project} initialColumns={board} roster={roster.length ? roster : mockMembers.slice(0, 5)} />;
}

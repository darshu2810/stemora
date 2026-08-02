import { notFound } from "next/navigation";
import { mockShowcaseProjects } from "@/lib/mock-global";
import { ProjectDetailClient } from "./project-detail-client";

export default async function PublicProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = mockShowcaseProjects.find((p) => p.id === projectId);
  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}

import { ResourceLibraryView } from "@/components/resources/resource-library-view";
import { requireStudent } from "@/lib/auth/session";
import { listResources } from "@/lib/db/queries";

export default async function StudentResourcesPage() {
  const session = await requireStudent();
  const resources = await listResources(session.schoolId);

  return (
    <ResourceLibraryView
      clubName={session.clubName ?? "STEM Club"}
      resources={resources}
      canManage={false}
    />
  );
}

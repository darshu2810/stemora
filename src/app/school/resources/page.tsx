import { ResourceLibraryView } from "@/components/resources/resource-library-view";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { listResources } from "@/lib/db/queries";

export default async function SchoolResourcesPage() {
  const session = await requireSchoolAdmin();
  const resources = await listResources(session.schoolId);

  return (
    <ResourceLibraryView
      clubName={session.clubName ?? "STEM Club"}
      resources={resources}
      canManage
    />
  );
}

import { ResourceLibraryView } from "@/components/resources/resource-library-view";

export default function StudentResourcesPage() {
  return <ResourceLibraryView eyebrow="My clubs" canManage={false} />;
}

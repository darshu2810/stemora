import { Inbox } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { RequestsView } from "@/components/platform/requests-view";
import { requireSession } from "@/lib/auth/session";
import { listSchoolApplications } from "@/lib/db/queries";

export default async function SchoolRequestsPage() {
  await requireSession("platform_owner");
  const applications = await listSchoolApplications();

  const pending = applications.filter((a) => a.status === "pending");
  const reviewed = applications.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA"
        title="School requests"
        description="Schools asking to run their STEM Club on STEMORA. Approving one creates its workspace and makes the applicant its School Admin."
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No requests yet"
          description="When a school applies from the public site, it will appear here for review."
        />
      ) : (
        <RequestsView pending={pending} reviewed={reviewed} />
      )}
    </div>
  );
}

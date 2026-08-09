import { CompetitionsView } from "@/components/competitions/competitions-view";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { listCompetitions } from "@/lib/db/queries";

export default async function SchoolCompetitionsPage() {
  const session = await requireSchoolAdmin();
  const competitions = await listCompetitions(session.schoolId);

  return (
    <CompetitionsView
      clubName={session.clubName ?? "STEM Club"}
      competitions={competitions}
      canManage
    />
  );
}

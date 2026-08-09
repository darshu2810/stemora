import { CompetitionsView } from "@/components/competitions/competitions-view";
import { requireStudent } from "@/lib/auth/session";
import { listCompetitions } from "@/lib/db/queries";

export default async function StudentCompetitionsPage() {
  const session = await requireStudent();
  const competitions = await listCompetitions(session.schoolId);

  return (
    <CompetitionsView
      clubName={session.clubName ?? "STEM Club"}
      competitions={competitions}
      canManage={false}
    />
  );
}

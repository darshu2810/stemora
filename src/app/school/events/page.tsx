import { SchoolEventsView } from "@/components/events/school-events-view";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { listEvents, todayISO } from "@/lib/db/queries";

export default async function SchoolEventsPage() {
  const session = await requireSchoolAdmin();
  return (
    <SchoolEventsView clubName={session.clubName ?? "STEM Club"}
      events={await listEvents(session.schoolId)} today={todayISO()} canManage />
  );
}

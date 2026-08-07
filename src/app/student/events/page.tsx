import { SchoolEventsView } from "@/components/events/school-events-view";
import { requireStudent } from "@/lib/auth/session";
import { listEvents, todayISO } from "@/lib/db/queries";

export default async function StudentEventsPage() {
  const session = await requireStudent();
  return (
    <SchoolEventsView clubName={session.clubName ?? "STEM Club"}
      events={await listEvents(session.schoolId)} today={todayISO()} canManage={false} />
  );
}

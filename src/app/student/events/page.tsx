import { SchoolEventsView } from "@/components/events/school-events-view";
import { MyAttendance } from "@/components/events/my-attendance";
import { requireStudent } from "@/lib/auth/session";
import { attendanceForStudent, listEvents, todayISO } from "@/lib/db/queries";

export default async function StudentEventsPage() {
  const session = await requireStudent();

  const [events, mine] = await Promise.all([
    listEvents(session.schoolId),
    attendanceForStudent(session.schoolId, session.userId),
  ]);

  return (
    <div className="space-y-10">
      <SchoolEventsView
        clubName={session.clubName ?? "STEM Club"}
        events={events}
        today={todayISO()}
        canManage={false}
        nextSessionNumber={null}
      />
      <MyAttendance records={mine} />
    </div>
  );
}

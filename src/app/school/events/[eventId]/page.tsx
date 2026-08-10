import { notFound } from "next/navigation";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { getSessionDetail } from "@/lib/db/queries";
import { AttendanceSheet } from "@/components/events/attendance-sheet";

export const metadata = { title: "Attendance · STEMORA" };

/**
 * A session's attendance sheet. Scoped to the admin's own school by the query
 * and again by RLS, so an event id belonging to another club is simply not
 * found rather than being reported as forbidden.
 */
export default async function SessionAttendancePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const session = await requireSchoolAdmin();
  const { eventId } = await params;

  const detail = await getSessionDetail(session.schoolId, eventId);
  // Also covers an event that exists but is not a Session: attendance is only
  // kept for sessions, and the database refuses it either way.
  if (!detail) notFound();

  return <AttendanceSheet session={detail} />;
}

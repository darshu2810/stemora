import { SchoolEventsView } from "@/components/events/school-events-view";
import { SessionHistory } from "@/components/events/session-history";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { listEvents, listSessions, todayISO } from "@/lib/db/queries";

export default async function SchoolEventsPage() {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  // Independent of each other, so they go together rather than one after
  // the next.
  const [events, sessions, { data: nextNumber }] = await Promise.all([
    listEvents(session.schoolId),
    listSessions(session.schoolId),
    supabase.rpc("next_session_number"),
  ]);

  return (
    <div className="space-y-10">
      <SchoolEventsView
        clubName={session.clubName ?? "STEM Club"}
        events={events}
        today={todayISO()}
        canManage
        nextSessionNumber={nextNumber ?? 1}
      />
      <SessionHistory sessions={sessions} />
    </div>
  );
}

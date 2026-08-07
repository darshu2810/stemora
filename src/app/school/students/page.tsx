import { requireSchoolAdmin } from "@/lib/auth/session";
import { listAccess } from "@/lib/db/queries";
import { AccessView } from "@/components/students/access-view";

export const metadata = { title: "Students · STEMORA" };

export default async function StudentsPage() {
  const session = await requireSchoolAdmin();
  const people = await listAccess(session.schoolId);

  return (
    <AccessView
      clubName={session.clubName ?? "STEM Club"}
      people={people}
      currentUserId={session.userId}
      // Sending an invitation needs the service role key. Say so on the page
      // rather than letting the first invitation fail with a cryptic error.
      canSendEmail={Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}
    />
  );
}

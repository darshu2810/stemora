import { requireSchoolAdmin } from "@/lib/auth/session";
import { listAccess, listSchoolAdmins } from "@/lib/db/queries";
import { AccessView } from "@/components/students/access-view";

export const metadata = { title: "Students · STEMORA" };

export default async function StudentsPage() {
  const session = await requireSchoolAdmin();
  const [people, admins] = await Promise.all([
    listAccess(session.schoolId),
    listSchoolAdmins(session.schoolId),
  ]);

  return (
    <AccessView
      clubName={session.clubName ?? "STEM Club"}
      people={people}
      admins={admins}
      currentUserId={session.userId}
      // Sending an invitation needs the service role key. Say so on the page
      // rather than letting the first invitation fail with a cryptic error.
      canSendEmail={Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}
    />
  );
}

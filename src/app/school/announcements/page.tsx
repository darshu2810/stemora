import { AnnouncementsView } from "@/components/announcements/announcements-view";
import { requireSchoolAdmin } from "@/lib/auth/session";
import { listAnnouncements } from "@/lib/db/queries";

export default async function SchoolAnnouncementsPage() {
  const session = await requireSchoolAdmin();
  const announcements = await listAnnouncements(session.schoolId);
  return (
    <AnnouncementsView
      clubName={session.clubName ?? "STEM Club"}
      announcements={announcements}
      canManage
    />
  );
}

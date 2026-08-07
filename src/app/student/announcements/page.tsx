import { AnnouncementsView } from "@/components/announcements/announcements-view";
import { requireStudent } from "@/lib/auth/session";
import { listAnnouncements } from "@/lib/db/queries";

export default async function StudentAnnouncementsPage() {
  const session = await requireStudent();
  const announcements = await listAnnouncements(session.schoolId);
  return (
    <AnnouncementsView
      clubName={session.clubName ?? "STEM Club"}
      announcements={announcements}
      canManage={false}
    />
  );
}

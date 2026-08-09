import { ProfileView } from "@/components/profile/profile-view";
import { requireStudent } from "@/lib/auth/session";
import {
  achievementsWithBadges,
  profileForUser,
  projectsForStudent,
} from "@/lib/db/queries";

export default async function StudentProfilePage() {
  const session = await requireStudent();
  const { schoolId, userId } = session;

  const [{ profile, skills, certificates }, achievements, projects] = await Promise.all([
    profileForUser(schoolId, userId),
    achievementsWithBadges(schoolId, userId),
    projectsForStudent(schoolId, userId),
  ]);

  return (
    <ProfileView
      session={{
        userId,
        fullName: session.fullName,
        email: session.email,
        clubName: session.clubName,
        schoolName: session.schoolName,
        district: session.district,
      }}
      profile={profile}
      skills={skills}
      certificates={certificates}
      achievements={achievements}
      projects={projects}
    />
  );
}

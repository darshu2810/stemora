import { MyTasksView } from "@/components/projects/my-tasks-view";
import { requireStudent } from "@/lib/auth/session";
import { listTasksForUser } from "@/lib/db/queries";

export default async function StudentTasksPage() {
  const session = await requireStudent();
  const tasks = await listTasksForUser(session.schoolId, session.userId);

  return (
    <MyTasksView
      clubName={session.clubName ?? "STEM Club"}
      tasks={tasks}
      basePath="/student/projects"
    />
  );
}

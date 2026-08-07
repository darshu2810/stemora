import "server-only";

import { createClient } from "@/lib/supabase/server";
import { initialsOf } from "@/lib/utils";
import type {
  Announcement,
  Badge,
  Competition,
  MembershipStatus,
  Project,
  ProjectTask,
  Resource,
  StemEvent,
  StudentAchievement,
  StudentCertificate,
  StudentProfile,
  StudentSkill,
  UserRoleEnum,
} from "@/lib/supabase/types";

/** A student as the app displays them: the person plus their membership. */
export type StudentRow = {
  id: string;
  name: string;
  email: string;
  grade: number | null;
  status: string;
  joinedAt: string;
};

export type ProjectWithTeam = Project & {
  leaderName: string | null;
  team: { id: string; name: string; email: string; initials: string }[];
};

export type TaskWithProject = ProjectTask & { projectName: string; assigneeName: string | null };


export const BOARD_COLUMNS = [
  { id: "backlog", name: "Backlog" },
  { id: "todo", name: "To Do" },
  { id: "in_progress", name: "In Progress" },
  { id: "in_review", name: "In Review" },
  { id: "done", name: "Done" },
] as const;

// --- Students ---------------------------------------------------------------

/**
 * Students who can actually sign in. Anyone still holding an unaccepted
 * invitation is excluded, so a project team can never be built from people who
 * have never logged in.
 */
export async function listStudents(schoolId: string): Promise<StudentRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("school_members")
    .select("grade, status, joined_at, users(id, full_name, email)")
    .eq("school_id", schoolId)
    .eq("role", "student")
    .eq("status", "active")
    .order("joined_at", { ascending: true });

  return (data ?? []).map((row) => {
    const u = row.users as unknown as { id: string; full_name: string; email: string };
    return {
      id: u.id,
      name: u.full_name,
      email: u.email,
      grade: row.grade,
      status: row.status,
      joinedAt: row.joined_at,
    };
  });
}

// --- Access -----------------------------------------------------------------

/** One person's standing with the school, as the School Admin manages it. */
export type AccessRow = {
  userId: string;
  name: string;
  email: string;
  role: UserRoleEnum;
  grade: number | null;
  status: MembershipStatus;
  joinedAt: string;
  /** Set only while the invitation is outstanding. */
  invitationId: string | null;
  expiresAt: string | null;
};

/**
 * Everyone with any standing at the school — active, invited, suspended, or
 * removed — in one list. This is the roster the School Admin governs, so it
 * deliberately hides nothing: a person who cannot sign in still appears, with
 * the reason why.
 */
export async function listAccess(schoolId: string): Promise<AccessRow[]> {
  const supabase = await createClient();

  const [{ data: members }, { data: invitations }] = await Promise.all([
    supabase
      .from("school_members")
      .select("user_id, role, grade, status, joined_at, users(id, full_name, email)")
      .eq("school_id", schoolId)
      .order("joined_at", { ascending: true }),
    supabase
      .from("invitations")
      .select("id, email, expires_at")
      .eq("school_id", schoolId)
      .eq("status", "pending"),
  ]);

  const pendingByEmail = new Map(
    (invitations ?? []).map((i) => [i.email.toLowerCase(), i] as const),
  );

  return (members ?? []).map((row) => {
    const u = row.users as unknown as { id: string; full_name: string; email: string };
    const invitation = row.status === "invited" ? pendingByEmail.get(u.email.toLowerCase()) : undefined;
    return {
      userId: u.id,
      name: u.full_name,
      email: u.email,
      role: row.role,
      grade: row.grade,
      status: row.status,
      joinedAt: row.joined_at,
      invitationId: invitation?.id ?? null,
      expiresAt: invitation?.expires_at ?? null,
    };
  });
}

// --- Projects ---------------------------------------------------------------

export async function listProjects(schoolId: string): Promise<ProjectWithTeam[]> {
  const supabase = await createClient();

  const [{ data: projects }, { data: members }] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .eq("school_id", schoolId)
      .order("due_date", { ascending: true }),
    supabase
      .from("project_members")
      .select("project_id, users(id, full_name, email)")
      .eq("school_id", schoolId),
  ]);

  const byProject = new Map<string, ProjectWithTeam["team"]>();
  for (const row of members ?? []) {
    const u = row.users as unknown as { id: string; full_name: string; email: string } | null;
    if (!u) continue;
    const list = byProject.get(row.project_id) ?? [];
    list.push({ id: u.id, name: u.full_name, email: u.email, initials: initialsOf(u.full_name) });
    byProject.set(row.project_id, list);
  }

  return (projects ?? []).map((p) => {
    const team = byProject.get(p.id) ?? [];
    return {
      ...p,
      team,
      leaderName: team.find((m) => m.id === p.leader_id)?.name ?? null,
    };
  });
}

export async function getProject(
  schoolId: string,
  projectId: string,
): Promise<ProjectWithTeam | null> {
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("school_id", schoolId)
    .eq("id", projectId)
    .maybeSingle();

  if (!project) return null;

  const { data: members } = await supabase
    .from("project_members")
    .select("users(id, full_name, email)")
    .eq("project_id", projectId);

  const team = (members ?? [])
    .map((row) => row.users as unknown as { id: string; full_name: string; email: string } | null)
    .filter((u): u is { id: string; full_name: string; email: string } => Boolean(u))
    .map((u) => ({ id: u.id, name: u.full_name, email: u.email, initials: initialsOf(u.full_name) }));

  return { ...project, team, leaderName: team.find((m) => m.id === project.leader_id)?.name ?? null };
}

export async function listProjectTasks(projectId: string): Promise<ProjectTask[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("position", { ascending: true });
  return data ?? [];
}

/** Task counts per project, so a grid can show progress without N queries. */
export async function taskCountsByProject(schoolId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_tasks")
    .select("project_id, column_id")
    .eq("school_id", schoolId);

  const counts = new Map<string, { done: number; total: number }>();
  for (const t of data ?? []) {
    const c = counts.get(t.project_id) ?? { done: 0, total: 0 };
    c.total += 1;
    if (t.column_id === "done") c.done += 1;
    counts.set(t.project_id, c);
  }
  return counts;
}

export async function listTasksForUser(
  schoolId: string,
  userId: string,
): Promise<TaskWithProject[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_tasks")
    .select("*, projects(name)")
    .eq("school_id", schoolId)
    .eq("assignee_id", userId)
    .order("due_date", { ascending: true, nullsFirst: false });

  return (data ?? []).map((t) => ({
    ...(t as unknown as ProjectTask),
    projectName: (t.projects as unknown as { name: string } | null)?.name ?? "",
    assigneeName: null,
  }));
}

/** Every unfinished task in the club, soonest deadline first. */
export async function listOpenTasks(schoolId: string, limit?: number): Promise<TaskWithProject[]> {
  const supabase = await createClient();
  let query = supabase
    .from("project_tasks")
    .select("*, projects(name), users:assignee_id(full_name)")
    .eq("school_id", schoolId)
    .neq("column_id", "done")
    .order("due_date", { ascending: true, nullsFirst: false });

  if (limit) query = query.limit(limit);
  const { data } = await query;

  return (data ?? []).map((t) => ({
    ...(t as unknown as ProjectTask),
    projectName: (t.projects as unknown as { name: string } | null)?.name ?? "",
    assigneeName: (t.users as unknown as { full_name: string } | null)?.full_name ?? null,
  }));
}

export async function projectsForStudent(
  schoolId: string,
  userId: string,
): Promise<ProjectWithTeam[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("school_id", schoolId)
    .eq("user_id", userId);

  const ids = new Set((data ?? []).map((r) => r.project_id));
  const all = await listProjects(schoolId);
  return all.filter((p) => ids.has(p.id));
}

// --- Competitions, events, resources, announcements -------------------------

export type CompetitionWithNames = Competition & { participants: string[] };

export async function listCompetitions(schoolId: string): Promise<CompetitionWithNames[]> {
  const supabase = await createClient();
  const [{ data: comps }, { data: parts }] = await Promise.all([
    supabase
      .from("competitions")
      .select("*")
      .eq("school_id", schoolId)
      .order("event_date", { ascending: false }),
    supabase
      .from("competition_participants")
      .select("competition_id, users(full_name)")
      .eq("school_id", schoolId),
  ]);

  const byComp = new Map<string, string[]>();
  for (const row of parts ?? []) {
    const u = row.users as unknown as { full_name: string } | null;
    if (!u) continue;
    byComp.set(row.competition_id, [...(byComp.get(row.competition_id) ?? []), u.full_name]);
  }

  return (comps ?? []).map((c) => ({ ...c, participants: byComp.get(c.id) ?? [] }));
}

export async function listEvents(schoolId: string): Promise<StemEvent[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("school_id", schoolId)
    .order("event_date", { ascending: true });
  return data ?? [];
}

export type ResourceWithUploader = Resource & { uploaderName: string };

export async function listResources(schoolId: string): Promise<ResourceWithUploader[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select("*, users:uploaded_by(full_name)")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => ({
    ...(r as unknown as Resource),
    uploaderName: (r.users as unknown as { full_name: string } | null)?.full_name ?? "",
  }));
}

export type AnnouncementWithAuthor = Announcement & { authorName: string };

export async function listAnnouncements(schoolId: string): Promise<AnnouncementWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("*, users:author_id(full_name)")
    .eq("school_id", schoolId)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  return (data ?? []).map((a) => ({
    ...(a as unknown as Announcement),
    authorName: (a.users as unknown as { full_name: string } | null)?.full_name ?? "",
  }));
}

// --- Achievements & profile -------------------------------------------------

export async function listBadges(): Promise<Badge[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("badges").select("*").order("sort_order");
  return data ?? [];
}

export async function achievementsForUser(
  schoolId: string,
  userId: string,
): Promise<StudentAchievement[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("student_achievements")
    .select("*")
    .eq("school_id", schoolId)
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });
  return data ?? [];
}

export async function profileForUser(schoolId: string, userId: string) {
  const supabase = await createClient();
  const [{ data: profile }, { data: skills }, { data: certificates }] = await Promise.all([
    supabase.from("student_profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("student_skills").select("*").eq("user_id", userId).order("category"),
    supabase
      .from("student_certificates")
      .select("*")
      .eq("user_id", userId)
      .order("issued_on", { ascending: false }),
  ]);

  return {
    profile: (profile ?? null) as StudentProfile | null,
    skills: (skills ?? []) as StudentSkill[],
    certificates: (certificates ?? []) as StudentCertificate[],
  };
}

// --- Club-wide counts -------------------------------------------------------

export type ClubStats = {
  students: number;
  pendingInvitations: number;
  projects: number;
  activeProjects: number;
  competitions: number;
  resources: number;
  announcements: number;
  upcomingEvents: number;
  openTasks: number;
};

/** Every headline number on the dashboards, counted in the database. */
export async function getClubStats(schoolId: string): Promise<ClubStats> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const count = { count: "exact" as const, head: true };

  const [
    students,
    invites,
    projects,
    activeProjects,
    competitions,
    resources,
    announcements,
    upcomingEvents,
    openTasks,
  ] = await Promise.all([
    supabase.from("school_members").select("id", count).eq("school_id", schoolId).eq("role", "student").eq("status", "active"),
    supabase.from("invitations").select("id", count).eq("school_id", schoolId).eq("status", "pending"),
    supabase.from("projects").select("id", count).eq("school_id", schoolId),
    supabase.from("projects").select("id", count).eq("school_id", schoolId).eq("status", "active"),
    supabase.from("competitions").select("id", count).eq("school_id", schoolId),
    supabase.from("resources").select("id", count).eq("school_id", schoolId),
    supabase.from("announcements").select("id", count).eq("school_id", schoolId),
    supabase.from("events").select("id", count).eq("school_id", schoolId).gte("event_date", today),
    supabase.from("project_tasks").select("id", count).eq("school_id", schoolId).neq("column_id", "done"),
  ]);

  return {
    students: students.count ?? 0,
    pendingInvitations: invites.count ?? 0,
    projects: projects.count ?? 0,
    activeProjects: activeProjects.count ?? 0,
    competitions: competitions.count ?? 0,
    resources: resources.count ?? 0,
    announcements: announcements.count ?? 0,
    upcomingEvents: upcomingEvents.count ?? 0,
    openTasks: openTasks.count ?? 0,
  };
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

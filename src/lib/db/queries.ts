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
  SchoolApplication,
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

// --- Schools ----------------------------------------------------------------

/** A school as it appears in the register page's dropdown. */
export type JoinableSchool = {
  id: string;
  name: string;
  clubName: string;
  district: string | null;
};

/**
 * The schools a student can ask to join. Read through a SECURITY DEFINER
 * function because the caller has no account yet — `schools` itself is
 * readable only by members, and must stay that way.
 */
export async function listJoinableSchools(): Promise<JoinableSchool[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("joinable_schools");

  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    clubName: s.club_name,
    district: s.district,
  }));
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

/** A current School Admin, for the succession panel. */
export type SchoolAdminRow = {
  userId: string;
  name: string;
  email: string;
  /** When they were appointed, or null for the admin the school started with. */
  adminSince: string | null;
  joinedAt: string;
};

/**
 * Who currently runs the club, and since when.
 *
 * "Since when" comes from the audit trail rather than the membership row,
 * because `joined_at` records when they joined the school, not when they took
 * the role. The School Admin created by the founders' approval has no promotion
 * entry, so theirs is null and the page says "since the club started" instead
 * of inventing a date.
 */
export async function listSchoolAdmins(schoolId: string): Promise<SchoolAdminRow[]> {
  const supabase = await createClient();

  const [{ data: members }, { data: promotions }] = await Promise.all([
    supabase
      .from("school_members")
      .select("user_id, joined_at, users(id, full_name, email)")
      .eq("school_id", schoolId)
      .eq("role", "school_admin")
      .eq("status", "active")
      .order("joined_at", { ascending: true }),
    supabase
      .from("activity_logs")
      .select("entity_id, created_at")
      .eq("school_id", schoolId)
      .eq("action", "school_admin_promoted")
      .order("created_at", { ascending: false }),
  ]);

  // Most recent promotion wins: someone can be appointed, step down, and be
  // appointed again, and the panel should show the current tenure.
  const promotedAt = new Map<string, string>();
  for (const p of promotions ?? []) {
    if (p.entity_id && !promotedAt.has(p.entity_id)) promotedAt.set(p.entity_id, p.created_at);
  }

  return (members ?? []).map((row) => {
    const u = row.users as unknown as { id: string; full_name: string; email: string };
    return {
      userId: u.id,
      name: u.full_name,
      email: u.email,
      adminSince: promotedAt.get(u.id) ?? null,
      joinedAt: row.joined_at,
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

// --- Platform ---------------------------------------------------------------

/**
 * Every request to bring a school onto STEMORA. RLS restricts this to Platform
 * Owners; an applicant reading the same table sees only their own row.
 */
export async function listSchoolApplications(): Promise<SchoolApplication[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("school_applications")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}


/**
 * A school as the Platform Owner sees it. Deliberately shallow: RLS lets a
 * Platform Owner read schools and memberships, but not what happens inside a
 * club — no projects, announcements, or resources. Counting those here would
 * silently return zero rather than the truth, so they are not offered.
 */
export type PlatformSchoolRow = {
  id: string;
  name: string;
  district: string | null;
  clubName: string;
  status: string;
  createdAt: string;
  students: number;
  admins: number;
  pending: number;
};

export async function listSchoolsForPlatform(): Promise<PlatformSchoolRow[]> {
  const supabase = await createClient();

  const [{ data: schools }, { data: members }] = await Promise.all([
    supabase
      .from("schools")
      .select("id, name, district, club_name, status, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("school_members").select("school_id, role, status"),
  ]);

  const tally = new Map<string, { students: number; admins: number; pending: number }>();
  for (const m of members ?? []) {
    const t = tally.get(m.school_id) ?? { students: 0, admins: 0, pending: 0 };
    if (m.status === "invited") t.pending += 1;
    else if (m.status === "active") {
      if (m.role === "school_admin") t.admins += 1;
      else if (m.role === "student") t.students += 1;
    }
    tally.set(m.school_id, t);
  }

  return (schools ?? []).map((s) => {
    const t = tally.get(s.id) ?? { students: 0, admins: 0, pending: 0 };
    return {
      id: s.id,
      name: s.name,
      district: s.district,
      clubName: s.club_name,
      status: s.status,
      createdAt: s.created_at,
      ...t,
    };
  });
}

// --- Recent activity --------------------------------------------------------

export type ActivityItem = {
  id: string;
  kind: "announcement" | "resource" | "competition" | "event";
  text: string;
  actor: string;
  date: string;
};

/**
 * The last things that actually happened in the club, composed from the rows
 * themselves rather than from an event log. Nothing here is narrated: if the
 * club has posted nothing, this is empty.
 */
export async function listRecentActivity(
  schoolId: string,
  limit = 5,
): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const recent = { ascending: false } as const;

  const [announcements, resources, competitions, events] = await Promise.all([
    supabase
      .from("announcements")
      .select("id, title, created_at, users:author_id(full_name)")
      .eq("school_id", schoolId)
      .order("created_at", recent)
      .limit(limit),
    supabase
      .from("resources")
      .select("id, title, created_at, users:uploaded_by(full_name)")
      .eq("school_id", schoolId)
      .order("created_at", recent)
      .limit(limit),
    supabase
      .from("competitions")
      .select("id, name, created_at")
      .eq("school_id", schoolId)
      .order("created_at", recent)
      .limit(limit),
    supabase
      .from("events")
      .select("id, title, created_at, users:created_by(full_name)")
      .eq("school_id", schoolId)
      .order("created_at", recent)
      .limit(limit),
  ]);

  const nameOf = (row: { users?: unknown }) =>
    (row.users as { full_name: string } | null)?.full_name ?? "";

  const items: ActivityItem[] = [
    ...(announcements.data ?? []).map((a) => ({
      id: `a-${a.id}`,
      kind: "announcement" as const,
      text: `Posted “${a.title}”`,
      actor: nameOf(a),
      date: a.created_at,
    })),
    ...(resources.data ?? []).map((r) => ({
      id: `r-${r.id}`,
      kind: "resource" as const,
      text: `Added “${r.title}” to the library`,
      actor: nameOf(r),
      date: r.created_at,
    })),
    ...(competitions.data ?? []).map((c) => ({
      id: `c-${c.id}`,
      kind: "competition" as const,
      text: `Entered ${c.name}`,
      actor: "",
      date: c.created_at,
    })),
    ...(events.data ?? []).map((e) => ({
      id: `e-${e.id}`,
      kind: "event" as const,
      text: `Scheduled ${e.title}`,
      actor: nameOf(e),
      date: e.created_at,
    })),
  ];

  return items
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

// --- Achievements & profile -------------------------------------------------

export async function listBadges(): Promise<Badge[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("badges").select("*").order("sort_order");
  return data ?? [];
}

export type AchievementWithBadge = StudentAchievement & {
  badgeName: string;
  badgeDescription: string;
};

/** A student's awards with the badge they were given, newest first. */
export async function achievementsWithBadges(
  schoolId: string,
  userId: string,
): Promise<AchievementWithBadge[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("student_achievements")
    .select("*, badges(name, description)")
    .eq("school_id", schoolId)
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  return (data ?? []).map((a) => {
    const badge = a.badges as unknown as { name: string; description: string } | null;
    return {
      ...(a as unknown as StudentAchievement),
      badgeName: badge?.name ?? "",
      badgeDescription: badge?.description ?? "",
    };
  });
}

/** The competitions this student is actually on the roster for. */
export async function competitionsForStudent(
  schoolId: string,
  userId: string,
): Promise<Competition[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competition_participants")
    .select("competitions(*)")
    .eq("school_id", schoolId)
    .eq("user_id", userId);

  return (data ?? [])
    .map((row) => row.competitions as unknown as Competition | null)
    .filter((c): c is Competition => Boolean(c))
    .sort((a, b) => (a.event_date < b.event_date ? 1 : -1));
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

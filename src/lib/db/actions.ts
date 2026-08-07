"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSchoolAdmin, requireSession } from "@/lib/auth/session";
import type {
  CompetitionLevel,
  EventType,
  ProjectCategory,
  ResourceType,
  TaskColumn,
  TaskPriority,
} from "@/lib/supabase/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ok = { ok: true } as const;
const fail = (error: string): ActionResult => ({ ok: false, error });

function str(fd: FormData, key: string) {
  return String(fd.get(key) ?? "").trim();
}

// --- Students ---------------------------------------------------------------

/**
 * Invites a student by email. Two things happen: an `invitations` row so the
 * admin can see who is outstanding, and a Supabase Auth invitation email that
 * carries the school and grade, so accepting it creates the membership without
 * the student typing anything but a password.
 */
export async function inviteStudent(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const email = str(fd, "email").toLowerCase();
  const fullName = str(fd, "fullName");
  const gradeRaw = str(fd, "grade");
  const grade = gradeRaw ? Number(gradeRaw) : null;

  if (!email) return fail("Enter the student's school email.");
  if (!fullName) return fail("Enter the student's full name.");

  const supabase = await createClient();

  const { error: rowError } = await supabase.from("invitations").insert({
    school_id: session.schoolId,
    email,
    full_name: fullName,
    grade,
    invited_by: session.userId,
  });

  if (rowError) {
    return fail(
      rowError.code === "23505"
        ? "That student already has a pending invitation."
        : rowError.message,
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
      data: { full_name: fullName, school_id: session.schoolId, grade },
    });
    if (error) throw error;
  } catch (e) {
    // The invitation is recorded either way; say plainly that the email didn't go.
    await supabase
      .from("invitations")
      .delete()
      .eq("school_id", session.schoolId)
      .eq("email", email)
      .eq("status", "pending");
    const message = e instanceof Error ? e.message : "Unknown error";
    return fail(`Couldn't send the invitation email: ${message}`);
  }

  revalidatePath("/school/students");
  return ok;
}

export async function revokeInvitation(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("invitations")
    .update({ status: "revoked" })
    .eq("id", str(fd, "invitationId"))
    .eq("school_id", session.schoolId);

  if (error) return fail(error.message);
  revalidatePath("/school/students");
  return ok;
}

export async function removeStudent(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("school_members")
    .delete()
    .eq("school_id", session.schoolId)
    .eq("user_id", str(fd, "userId"))
    .eq("role", "student");

  if (error) return fail(error.message);
  revalidatePath("/school/students");
  return ok;
}

// --- Projects ---------------------------------------------------------------

export async function createProject(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const name = str(fd, "name");
  const dueDate = str(fd, "dueDate");
  if (!name) return fail("Enter a project name.");
  if (!dueDate) return fail("Choose a due date.");

  const leaderId = str(fd, "leaderId") || null;

  const { data, error } = await supabase
    .from("projects")
    .insert({
      school_id: session.schoolId,
      name,
      description: str(fd, "description"),
      category: str(fd, "category") as ProjectCategory,
      due_date: dueDate,
      leader_id: leaderId,
      created_by: session.userId,
    })
    .select("id")
    .single();

  if (error) return fail(error.message);

  if (leaderId && data) {
    await supabase.from("project_members").insert({
      school_id: session.schoolId,
      project_id: data.id,
      user_id: leaderId,
    });
  }

  revalidatePath("/school/projects");
  revalidatePath("/school/dashboard");
  return ok;
}

export async function setProjectStatus(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ status: str(fd, "status") as "active" | "completed" })
    .eq("id", str(fd, "projectId"))
    .eq("school_id", session.schoolId);

  if (error) return fail(error.message);
  revalidatePath("/school/projects");
  return ok;
}

export async function addProjectMember(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();
  const projectId = str(fd, "projectId");

  const { error } = await supabase.from("project_members").insert({
    school_id: session.schoolId,
    project_id: projectId,
    user_id: str(fd, "userId"),
  });

  if (error && error.code !== "23505") return fail(error.message);
  revalidatePath(`/school/projects/${projectId}`);
  return ok;
}

export async function removeProjectMember(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();
  const projectId = str(fd, "projectId");

  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("school_id", session.schoolId)
    .eq("project_id", projectId)
    .eq("user_id", str(fd, "userId"));

  if (error) return fail(error.message);
  revalidatePath(`/school/projects/${projectId}`);
  return ok;
}

// --- Tasks ------------------------------------------------------------------

export async function createTask(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const projectId = str(fd, "projectId");
  const title = str(fd, "title");
  if (!title) return fail("Enter a task title.");

  const { error } = await supabase.from("project_tasks").insert({
    school_id: session.schoolId,
    project_id: projectId,
    title,
    assignee_id: str(fd, "assigneeId") || null,
    column_id: (str(fd, "column") || "backlog") as TaskColumn,
    priority: (str(fd, "priority") || "medium") as TaskPriority,
    due_date: str(fd, "dueDate") || null,
  });

  if (error) return fail(error.message);
  revalidatePath(`/school/projects/${projectId}`);
  revalidatePath("/school/dashboard");
  return ok;
}

/**
 * Moving a card. Allowed for the School Admin on any task, and for a student
 * on a task assigned to them — the second case is enforced by RLS, not here.
 */
export async function moveTask(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSession();
  const supabase = await createClient();

  const taskId = str(fd, "taskId");
  const projectId = str(fd, "projectId");

  const { error } = await supabase
    .from("project_tasks")
    .update({ column_id: str(fd, "column") as TaskColumn })
    .eq("id", taskId);

  if (error) return fail(error.message);

  const base = session.role === "school_admin" ? "/school" : "/student";
  revalidatePath(`${base}/projects/${projectId}`);
  revalidatePath(`${base}/dashboard`);
  revalidatePath("/student/tasks");
  return ok;
}

export async function deleteTask(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();
  const projectId = str(fd, "projectId");

  const { error } = await supabase
    .from("project_tasks")
    .delete()
    .eq("id", str(fd, "taskId"))
    .eq("school_id", session.schoolId);

  if (error) return fail(error.message);
  revalidatePath(`/school/projects/${projectId}`);
  return ok;
}

// --- Competitions -----------------------------------------------------------

export async function createCompetition(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const name = str(fd, "name");
  const date = str(fd, "date");
  if (!name) return fail("Enter a competition name.");
  if (!date) return fail("Choose a date.");

  const { error } = await supabase.from("competitions").insert({
    school_id: session.schoolId,
    name,
    category: str(fd, "category") as ProjectCategory,
    level: str(fd, "level") as CompetitionLevel,
    event_date: date,
  });

  if (error) return fail(error.message);
  revalidatePath("/school/competitions");
  return ok;
}

export async function recordCompetitionResult(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("competitions")
    .update({
      status: "completed",
      result: str(fd, "result") || null,
      podium: fd.get("podium") === "on",
    })
    .eq("id", str(fd, "competitionId"))
    .eq("school_id", session.schoolId);

  if (error) return fail(error.message);
  revalidatePath("/school/competitions");
  return ok;
}

export async function setCompetitionRoster(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();
  const competitionId = str(fd, "competitionId");
  const userIds = fd.getAll("userIds").map(String).filter(Boolean);

  await supabase
    .from("competition_participants")
    .delete()
    .eq("school_id", session.schoolId)
    .eq("competition_id", competitionId);

  if (userIds.length > 0) {
    const { error } = await supabase.from("competition_participants").insert(
      userIds.map((user_id) => ({
        school_id: session.schoolId,
        competition_id: competitionId,
        user_id,
      })),
    );
    if (error) return fail(error.message);
  }

  revalidatePath("/school/competitions");
  return ok;
}

// --- Events -----------------------------------------------------------------

export async function createEvent(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const title = str(fd, "title");
  const date = str(fd, "date");
  const time = str(fd, "time");
  const location = str(fd, "location");
  if (!title || !date || !time || !location) {
    return fail("Title, date, time, and location are all needed.");
  }

  const { error } = await supabase.from("events").insert({
    school_id: session.schoolId,
    title,
    type: (str(fd, "type") || "Meeting") as EventType,
    event_date: date,
    start_time: time,
    location,
    created_by: session.userId,
  });

  if (error) return fail(error.message);
  revalidatePath("/school/events");
  revalidatePath("/school/dashboard");
  return ok;
}

export async function cancelEvent(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", str(fd, "eventId"))
    .eq("school_id", session.schoolId);

  if (error) return fail(error.message);
  revalidatePath("/school/events");
  return ok;
}

/** A student saying they're coming, or taking it back. */
export async function toggleRsvp(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.schoolId) return fail("You're not in a STEM Club.");
  const supabase = await createClient();
  const eventId = str(fd, "eventId");

  const { data: existing } = await supabase
    .from("event_rsvps")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", session.userId)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("event_rsvps").delete().eq("id", existing.id)
    : await supabase.from("event_rsvps").insert({
        school_id: session.schoolId,
        event_id: eventId,
        user_id: session.userId,
      });

  if (error) return fail(error.message);
  revalidatePath("/student/events");
  revalidatePath("/school/events");
  return ok;
}

// --- Resources --------------------------------------------------------------

export async function addResource(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const title = str(fd, "title");
  const type = (str(fd, "type") || "link") as ResourceType;
  const url = str(fd, "url");
  if (!title) return fail("Enter a title.");
  if (type === "link" && !url) return fail("Enter the link address.");

  const category = str(fd, "category");

  const { error } = await supabase.from("resources").insert({
    school_id: session.schoolId,
    title,
    category: category ? (category as ProjectCategory) : null,
    type,
    url: type === "link" ? url : null,
    storage_path: type === "file" ? str(fd, "storagePath") || `pending/${title}` : null,
    uploaded_by: session.userId,
  });

  if (error) return fail(error.message);
  revalidatePath("/school/resources");
  return ok;
}

export async function deleteResource(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("resources")
    .delete()
    .eq("id", str(fd, "resourceId"))
    .eq("school_id", session.schoolId);

  if (error) return fail(error.message);
  revalidatePath("/school/resources");
  return ok;
}

// --- Announcements ----------------------------------------------------------

export async function postAnnouncement(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const title = str(fd, "title");
  const body = str(fd, "body");
  if (!title) return fail("Enter a title.");
  if (!body) return fail("Write a short message.");

  const { error } = await supabase.from("announcements").insert({
    school_id: session.schoolId,
    author_id: session.userId,
    title,
    body,
    pinned: fd.get("pinned") === "on",
  });

  if (error) return fail(error.message);
  revalidatePath("/school/announcements");
  revalidatePath("/school/dashboard");
  return ok;
}

export async function deleteAnnouncement(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", str(fd, "announcementId"))
    .eq("school_id", session.schoolId);

  if (error) return fail(error.message);
  revalidatePath("/school/announcements");
  return ok;
}

// --- Achievements -----------------------------------------------------------

export async function awardAchievement(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("student_achievements").insert({
    school_id: session.schoolId,
    user_id: str(fd, "userId"),
    badge_id: str(fd, "badgeId"),
    note: str(fd, "note") || null,
    awarded_by: session.userId,
  });

  if (error) {
    return fail(error.code === "23505" ? "That student already holds this award." : error.message);
  }
  revalidatePath("/school/students");
  return ok;
}

// --- School settings & own profile ------------------------------------------

export async function updateSchool(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSchoolAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("schools")
    .update({
      name: str(fd, "schoolName"),
      club_name: str(fd, "clubName"),
      district: str(fd, "district") || null,
    })
    .eq("id", session.schoolId);

  if (error) return fail(error.message);
  revalidatePath("/", "layout");
  return ok;
}

export async function saveProfile(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.schoolId) return fail("You're not in a STEM Club.");
  const supabase = await createClient();

  const { error } = await supabase.from("student_profiles").upsert({
    user_id: session.userId,
    school_id: session.schoolId,
    headline: str(fd, "headline") || null,
    about: str(fd, "about") || null,
    location: str(fd, "location") || null,
  });

  if (error) return fail(error.message);
  revalidatePath("/student/profile");
  return ok;
}

export async function addSkill(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.schoolId) return fail("You're not in a STEM Club.");
  const supabase = await createClient();

  const name = str(fd, "name");
  if (!name) return fail("Enter a skill name.");

  const { error } = await supabase.from("student_skills").insert({
    school_id: session.schoolId,
    user_id: session.userId,
    name,
    category: str(fd, "category") || "General",
    level: Number(str(fd, "level") || 3),
  });

  if (error) {
    return fail(error.code === "23505" ? "That skill is already on your profile." : error.message);
  }
  revalidatePath("/student/profile");
  return ok;
}

export async function removeSkill(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSession();
  const supabase = await createClient();

  const { error } = await supabase
    .from("student_skills")
    .delete()
    .eq("id", str(fd, "skillId"))
    .eq("user_id", session.userId);

  if (error) return fail(error.message);
  revalidatePath("/student/profile");
  return ok;
}

export async function addCertificate(_prev: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  const session = await requireSession();
  if (!session.schoolId) return fail("You're not in a STEM Club.");
  const supabase = await createClient();

  const title = str(fd, "title");
  const issuer = str(fd, "issuer");
  const issuedOn = str(fd, "issuedOn");
  if (!title || !issuer || !issuedOn) return fail("Title, issuer, and date are all needed.");

  const { error } = await supabase.from("student_certificates").insert({
    school_id: session.schoolId,
    user_id: session.userId,
    title,
    issuer,
    issued_on: issuedOn,
  });

  if (error) return fail(error.message);
  revalidatePath("/student/profile");
  return ok;
}

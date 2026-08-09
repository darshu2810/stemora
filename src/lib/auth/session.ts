import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/config/roles";
import type { ApplicationStatus } from "@/lib/supabase/types";

export type Session = {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  /** Null only for a Platform Owner, who belongs to no school. */
  schoolId: string | null;
  schoolName: string | null;
  clubName: string | null;
  district: string | null;
  grade: number | null;
};

/**
 * The signed-in user, their role, and the school they belong to — or null if
 * there is no session. Every dashboard page starts here, and the role it
 * returns comes from the database, never from anything the client can set.
 */
export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, full_name, platform_role")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (!profile) return null;

  const { data: membership } = await supabase
    .from("school_members")
    .select("role, grade, school_id, schools(id, name, club_name, district)")
    .eq("user_id", auth.user.id)
    .eq("status", "active")
    .maybeSingle();

  // Platform Owner outranks any school membership; they answer to no school.
  if (profile.platform_role === "platform_owner") {
    return {
      userId: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: "platform_owner",
      schoolId: null,
      schoolName: null,
      clubName: null,
      district: null,
      grade: null,
    };
  }

  if (!membership) return null;

  const school = membership.schools as unknown as {
    id: string;
    name: string;
    club_name: string;
    district: string | null;
  } | null;

  return {
    userId: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    role: membership.role as UserRole,
    schoolId: membership.school_id,
    schoolName: school?.name ?? null,
    clubName: school?.club_name ?? null,
    district: school?.district ?? null,
    grade: membership.grade,
  };
}

/** A signed-in applicant's standing, for the waitlist page and for routing. */
export type ApplicationStanding = {
  status: ApplicationStatus;
  schoolName: string;
  rejectionReason: string | null;
  submittedAt: string;
};

/**
 * The most recent request this account has made to bring a school onto
 * STEMORA, or null if it has never made one. Confirming an email address does
 * not touch this: approval is the founders' decision, and nothing else.
 */
export async function applicationFor(userId: string): Promise<ApplicationStanding | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("school_applications")
    .select("status, school_name, rejection_reason, created_at")
    .eq("applicant_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return {
    status: data.status,
    schoolName: data.school_name,
    rejectionReason: data.rejection_reason,
    submittedAt: data.created_at,
  };
}

/**
 * Why a signed-in user has no workspace: they belong to no school, or their
 * School Admin has closed their access.
 */
export type BlockedReason = "invited" | "suspended" | "removed";

/**
 * The standing of a signed-in user who has no *active* membership. Null means
 * they genuinely belong to no school and should register one.
 */
export async function getBlockedReason(userId: string): Promise<BlockedReason | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("school_members")
    .select("status, schools(name)")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data || data.status === "active") return null;
  return data.status as BlockedReason;
}

/**
 * The session, or a redirect. `role` narrows it further: a Student hitting a
 * School Admin page is sent to their own dashboard rather than shown a page
 * they have no business seeing.
 */
export async function requireSession(role?: UserRole): Promise<Session> {
  const session = await getSession();

  if (!session) {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (auth.user) {
      redirect(await landingForUserWithoutWorkspace(auth.user.id));
    }
    redirect("/login");
  }

  if (role && session.role !== role) {
    redirect(dashboardFor(session.role));
  }

  return session;
}

/**
 * Where a signed-in account with no active membership belongs. Every caller
 * routes through this, which is what stops the old bounce between /login and
 * /schools/new: each state has exactly one destination, and /waitlist and
 * /no-access are both terminal.
 */
export async function landingForUserWithoutWorkspace(userId: string): Promise<string> {
  // Access a School Admin paused or closed: say so, rather than offering a
  // registration form they never asked for.
  const blocked = await getBlockedReason(userId);
  if (blocked) return "/no-access";

  // Waiting on the founders, or turned down: both are terminal pages that
  // explain the position and never redirect onward.
  const application = await applicationFor(userId);
  if (application && application.status !== "approved") return "/waitlist";

  // Never applied. The form is the right place.
  return "/schools/new";
}

export function dashboardFor(role: UserRole): string {
  switch (role) {
    case "platform_owner":
      return "/platform/dashboard";
    case "school_admin":
      return "/school/dashboard";
    case "student":
      return "/student/dashboard";
  }
}

/** The School Admin's school id, or a redirect. Used by every /school page. */
export async function requireSchoolAdmin(): Promise<Session & { schoolId: string }> {
  const session = await requireSession("school_admin");
  if (!session.schoolId) redirect("/schools/new");
  return session as Session & { schoolId: string };
}

/** The Student's school id, or a redirect. Used by every /student page. */
export async function requireStudent(): Promise<Session & { schoolId: string }> {
  const session = await requireSession("student");
  if (!session.schoolId) redirect("/login");
  return session as Session & { schoolId: string };
}

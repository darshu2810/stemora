import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/config/roles";

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
    // Signed in, but not attached to a school yet — finish registration.
    if (auth.user) redirect("/schools/new");
    redirect("/login");
  }

  if (role && session.role !== role) {
    redirect(dashboardFor(session.role));
  }

  return session;
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

// The three roles in STEMORA, and nothing else.
//
//   Platform Owner — STEMORA staff, oversees the schools on the platform.
//   School Admin   — runs their school's STEM Club.
//   Student        — a member of their school's STEM Club.
//
// A project leader is an attribute of a project, not a role: that student
// still signs in as a Student. There are no officers, mentors, teachers,
// coordinators, or judges.
export type UserRole = "platform_owner" | "school_admin" | "student";

export const ROLE_LABELS: Record<UserRole, string> = {
  platform_owner: "Platform Owner",
  school_admin: "School Admin",
  student: "Student",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  platform_owner: "STEMORA staff. Sees the schools on the platform, never a school's internal data.",
  school_admin: "Runs the school's STEM Club — students, projects, competitions, resources, events, and announcements.",
  student: "A member of the STEM Club. Works on projects, tracks tasks, and enters competitions.",
};

// Every role, most senior first.
export const ALL_ROLES: UserRole[] = ["platform_owner", "school_admin", "student"];

// Roles that exist inside a school's workspace. Platform Owner is STEMORA
// staff and is never a member of a school's STEM Club.
export const SCHOOL_ROLES: UserRole[] = ["school_admin", "student"];

// Which dashboard a given role lands on after signing in.
export function dashboardForRole(role: UserRole): string {
  switch (role) {
    case "platform_owner":
      return "/platform/dashboard";
    case "school_admin":
      return "/school/dashboard";
    case "student":
      return "/student/dashboard";
  }
}

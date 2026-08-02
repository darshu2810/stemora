import { isEnabled } from "@/config/features";

export type UserRole = "platform_owner" | "school_admin" | "student";

export const ROLE_LABELS: Record<UserRole, string> = {
  platform_owner: "Platform Owner",
  school_admin: "School Admin",
  student: "Student",
};

// Order matters: index = seniority (0 is highest). Single source of truth for
// hierarchy checks — mirrors the has_school_role() Postgres helper described
// in docs/architecture/database-schema.md.
export const ROLE_HIERARCHY: UserRole[] = ["platform_owner", "school_admin", "student"];

export function hasRole(current: UserRole, minRole: UserRole): boolean {
  return ROLE_HIERARCHY.indexOf(current) <= ROLE_HIERARCHY.indexOf(minRole);
}

// Roles a pilot school actually signs in as. platform_owner is deliberately
// absent: the super-admin console is parked for the MVP (features.platformConsole),
// so there is nowhere for that persona to land.
export const PREVIEW_ROLES: UserRole[] = ROLE_HIERARCHY.filter(
  (role) => role !== "platform_owner" || isEnabled("platformConsole"),
);

// Roles that can be held inside a school workspace. platform_owner is STEMORA
// staff, never a school member.
export const SCHOOL_ROLES: UserRole[] = ROLE_HIERARCHY.filter((role) => role !== "platform_owner");

// Which dashboard a given role lands on.
export function dashboardForRole(role: UserRole): string {
  switch (role) {
    case "platform_owner":
      return isEnabled("platformConsole") ? "/platform/dashboard" : "/school/dashboard";
    case "school_admin":
      return "/school/dashboard";
    case "student":
      return "/student/dashboard";
  }
}

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
  Settings,
  FolderKanban,
  ListChecks,
  Megaphone,
  Library,
  UserCircle2,
  Award,
  Trophy,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

// Every entry here points at a page that exists and works. There are no
// feature flags and no parked routes — if it is in the sidebar, it ships.

// STEMORA staff see the schools on the platform and nothing inside them.
export const platformNav: NavItem[] = [
  { label: "Schools", href: "/platform/dashboard", icon: Building2 },
];

// The School Admin manages exactly one STEM Club, so the sidebar is that
// club's surfaces and nothing else.
export const schoolNav: NavItem[] = [
  { label: "Dashboard", href: "/school/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/school/students", icon: Users },
  { label: "Projects", href: "/school/projects", icon: FolderKanban },
  { label: "Competitions", href: "/school/competitions", icon: Trophy },
  { label: "Events", href: "/school/events", icon: CalendarDays },
  { label: "Resources", href: "/school/resources", icon: Library },
  { label: "Announcements", href: "/school/announcements", icon: Megaphone },
  { label: "Settings", href: "/school/settings", icon: Settings },
];

export const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Projects", href: "/student/projects", icon: FolderKanban },
  { label: "My Tasks", href: "/student/tasks", icon: ListChecks },
  { label: "Competitions", href: "/student/competitions", icon: Trophy },
  { label: "Events", href: "/student/events", icon: CalendarDays },
  { label: "Resources", href: "/student/resources", icon: Library },
  { label: "Announcements", href: "/student/announcements", icon: Megaphone },
  { label: "Achievements", href: "/student/achievements", icon: Award },
  { label: "Profile", href: "/student/profile", icon: UserCircle2 },
];

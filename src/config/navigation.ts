import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  ScrollText,
  Flag,
  LayoutGrid,
  Users,
  CalendarDays,
  MessagesSquare,
  Settings,
  FolderKanban,
  ListChecks,
  Megaphone,
  Library,
  UserCircle2,
  Award,
  Trophy,
  BarChart2,
  Bell,
} from "lucide-react";
import { enabledOnly, type Gated } from "@/config/features";

export type NavItem = { label: string; href: string; icon: LucideIcon };

// Entries carrying a `feature` are parked (see src/config/features.ts). They
// stay listed here on purpose — enabledOnly() filters them out of the rendered
// sidebar, so re-enabling a module is a one-line flag flip plus moving its
// route folder back out of src/future-modules/routes/.
const PLATFORM_NAV: Gated<NavItem>[] = [
  { label: "Dashboard", href: "/platform/dashboard", icon: LayoutDashboard, feature: "platformConsole" },
  { label: "Schools", href: "/platform/schools", icon: Building2, feature: "platformConsole" },
  { label: "Billing", href: "/platform/billing", icon: CreditCard, feature: "billing" },
  { label: "Analytics", href: "/platform/analytics", icon: BarChart3, feature: "platformConsole" },
  { label: "Audit log", href: "/platform/audit-log", icon: ScrollText, feature: "platformConsole" },
  { label: "Feature flags", href: "/platform/feature-flags", icon: Flag, feature: "platformConsole" },
];

const SCHOOL_NAV: Gated<NavItem>[] = [
  { label: "Dashboard", href: "/school/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/school/members", icon: Users },
  { label: "Projects", href: "/school/projects", icon: FolderKanban },
  { label: "Competitions", href: "/school/competitions", icon: Trophy },
  { label: "Events", href: "/school/events", icon: CalendarDays },
  { label: "Resources", href: "/school/resources", icon: Library },
  { label: "Announcements", href: "/school/announcements", icon: Megaphone },
  { label: "Settings", href: "/school/settings", icon: Settings },
  { label: "Clubs", href: "/school/clubs", icon: LayoutGrid, feature: "clubs" },
  { label: "Tasks", href: "/school/tasks", icon: ListChecks, feature: "schoolTasks" },
  { label: "Calendar", href: "/school/calendar", icon: CalendarDays, feature: "schoolCalendar" },
  { label: "Messages", href: "/school/messages", icon: MessagesSquare, feature: "messaging" },
];

const STUDENT_NAV: Gated<NavItem>[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Projects", href: "/student/projects", icon: FolderKanban },
  { label: "My Tasks", href: "/student/tasks", icon: ListChecks },
  { label: "Calendar", href: "/student/calendar", icon: CalendarDays },
  { label: "Resources", href: "/student/resources", icon: Library },
  { label: "Achievements", href: "/student/achievements", icon: Award },
  { label: "Profile", href: "/student/profile", icon: UserCircle2 },
  { label: "Competitions", href: "/student/competitions", icon: Trophy, feature: "globalCompetitions" },
  { label: "Leaderboard", href: "/student/leaderboard", icon: BarChart2, feature: "leaderboard" },
  { label: "Messages", href: "/student/messages", icon: MessagesSquare, feature: "messaging" },
  { label: "Notifications", href: "/student/notifications", icon: Bell, feature: "notificationsPage" },
  { label: "Settings", href: "/student/settings", icon: Settings, feature: "studentSettings" },
];

export const platformNav: NavItem[] = enabledOnly(PLATFORM_NAV);
export const schoolNav: NavItem[] = enabledOnly(SCHOOL_NAV);
export const studentNav: NavItem[] = enabledOnly(STUDENT_NAV);

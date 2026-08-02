import type { UserRole } from "@/config/roles";

// Fixture data for building UI ahead of the backend. Shape mirrors the real
// schema in docs/architecture/database-schema.md so swapping in real
// Supabase queries later is a drop-in replacement, not a rewrite.

export type MockUser = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarInitials: string;
  club?: string;
};

export const mockSchool = {
  id: "school_1",
  name: "SMA Negeri 8 Jakarta",
  slug: "sman8-jakarta",
  district: "Jakarta Selatan",
  plan: "Standard",
  memberCount: 727,
  clubCount: 17,
};

export const mockUsers: Record<UserRole, MockUser> = {
  platform_owner: {
    id: "u_owner",
    name: "Avery Chen",
    role: "platform_owner",
    email: "avery@stemora.com",
    avatarInitials: "AC",
  },
  school_admin: {
    id: "u_admin",
    name: "Bu Rina Wijaya",
    role: "school_admin",
    email: "rina.wijaya@sman8jakarta.sch.id",
    avatarInitials: "RW",
  },
  student: {
    id: "u_student",
    name: "Sofia Kim",
    role: "student",
    email: "sofia.kim@student.sman8jakarta.sch.id",
    avatarInitials: "SK",
    club: "Robotics Club",
  },
};

export const mockClubs = [
  { id: "club_robotics", name: "Robotics Club", category: "Robotics", members: 34, cover: "from-primary to-brand-spark" },
  { id: "club_code", name: "Code Collective", category: "Computer Science", members: 51, cover: "from-emerald-500 to-teal-400" },
  { id: "club_bio", name: "Bio Innovators", category: "Biology", members: 22, cover: "from-fuchsia-500 to-purple-500" },
  { id: "club_math", name: "Math Olympiad Team", category: "Mathematics", members: 18, cover: "from-amber-500 to-orange-500" },
];

export const mockAssignments = [
  { id: "a1", title: "Line-Following Robot: Sensor Calibration", club: "Robotics Club", due: "Aug 8", status: "published" as const, submissions: 21, total: 34 },
  { id: "a2", title: "Autonomous Navigation Writeup", club: "Robotics Club", due: "Aug 12", status: "draft" as const, submissions: 0, total: 34 },
  { id: "a3", title: "Regional Qualifier Design Doc", club: "Robotics Club", due: "Jul 30", status: "published" as const, submissions: 34, total: 34 },
];

export const mockNotifications = [
  { id: "n1", title: "New submission from Sofia Kim", body: "Line-Following Robot: Sensor Calibration", time: "12m ago", unread: true },
  { id: "n2", title: "Assignment graded", body: "Regional Qualifier Design Doc — 92/100", time: "2h ago", unread: true },
  { id: "n3", title: "Aditya Pratama invited you", body: "Join Robotics Club as a member", time: "1d ago", unread: false },
];

// STEMORA is launching in Jakarta first (see product context) — platform-level
// mock data reflects that city-scale rollout rather than a global figure.
export const mockPlatformStats = {
  totalSchools: 42,
  totalStudents: 8_140,
  totalClubs: 316,
  mrr: 6_240,
};

export type SchoolPlan = "Free" | "Standard" | "Premium";
export type SchoolStatus = "active" | "suspended" | "pending";

export type MockSchoolRecord = {
  id: string;
  name: string;
  district: string;
  plan: SchoolPlan;
  members: number;
  clubs: number;
  status: SchoolStatus;
  joinedAt: string;
};

const DISTRICTS = [
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Barat",
  "Jakarta Timur",
  "Jakarta Utara",
  "Tangerang Selatan",
];

const SCHOOL_NAMES = [
  "SMA Negeri 8 Jakarta",
  "SMA Negeri 28 Jakarta",
  "SMA Negeri 70 Jakarta",
  "SMA Labschool Kebayoran",
  "SMA Kristen IPEKA",
  "SMA BPK Penabur Jakarta",
  "Sekolah Cikal Amri Setu",
  "Jakarta Nurul Fikri STEM School",
  "SMA Global Sevilla",
  "SMA Tarakanita Jakarta",
  "SMA Santa Ursula Jakarta",
  "SMA Al Azhar Kebayoran",
  "SMAK 5 Penabur",
  "Sekolah Pelita Harapan Kemang",
  "SMA Negeri 3 Jakarta",
  "Global Prestasi School",
  "SMA Kanisius Jakarta",
  "SMA Negeri 46 Jakarta",
  "Sekolah Highscope Indonesia",
  "SMA Regina Pacis Jakarta",
  "SMA Negeri 21 Jakarta",
  "Binus School Serpong",
  "SMA Negeri 6 Jakarta",
  "Sekolah Victory Plus",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const mockSchools: MockSchoolRecord[] = SCHOOL_NAMES.map((name, i) => {
  const r1 = seededRandom(i + 1);
  const r2 = seededRandom(i + 51);
  const r3 = seededRandom(i + 101);
  const plan: SchoolPlan = r1 > 0.75 ? "Premium" : r1 > 0.4 ? "Standard" : "Free";
  const status: SchoolStatus = r2 > 0.93 ? "suspended" : r2 > 0.85 ? "pending" : "active";
  const members = Math.round(60 + r1 * 940);
  const month = 1 + Math.floor(r3 * 7);
  return {
    id: `school_${i + 1}`,
    name,
    district: DISTRICTS[i % DISTRICTS.length],
    plan,
    members,
    clubs: Math.max(1, Math.round(members / 42)),
    status,
    joinedAt: `2026-0${month}-${String(1 + Math.floor(r2 * 27)).padStart(2, "0")}`,
  };
});

export const mockGrowthSeries = [
  { month: "Feb", schools: 6, students: 980 },
  { month: "Mar", schools: 11, students: 1_920 },
  { month: "Apr", schools: 17, students: 3_140 },
  { month: "May", schools: 24, students: 4_460 },
  { month: "Jun", schools: 31, students: 5_890 },
  { month: "Jul", schools: 37, students: 7_120 },
  { month: "Aug", schools: 42, students: 8_140 },
];

export const mockPlanDistribution = [
  { plan: "Free", count: mockSchools.filter((s) => s.plan === "Free").length },
  { plan: "Standard", count: mockSchools.filter((s) => s.plan === "Standard").length },
  { plan: "Premium", count: mockSchools.filter((s) => s.plan === "Premium").length },
];

export type PlatformAuditEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
};

export const mockPlatformAuditLog: PlatformAuditEntry[] = [
  { id: "log1", actor: "Avery Chen", action: "school.plan_changed", target: "SMA Kristen IPEKA → Premium", time: "2026-08-01 14:22" },
  { id: "log2", actor: "Avery Chen", action: "school.suspended", target: "Sekolah Victory Plus", time: "2026-07-31 09:05" },
  { id: "log3", actor: "System", action: "school.created", target: "Global Prestasi School", time: "2026-07-29 11:47" },
  { id: "log4", actor: "Avery Chen", action: "support.impersonation_started", target: "SMA Negeri 8 Jakarta", time: "2026-07-28 16:10" },
  { id: "log5", actor: "System", action: "billing.payment_failed", target: "SMA Negeri 21 Jakarta", time: "2026-07-27 03:00" },
  { id: "log6", actor: "Avery Chen", action: "feature_flag.enabled", target: "wiki_v2 → all Premium schools", time: "2026-07-25 10:30" },
];

export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  scope: string;
  enabled: boolean;
};

export const mockFeatureFlags: FeatureFlag[] = [
  { id: "flag_wiki_v2", name: "Club wiki v2 editor", description: "Block-based rich text editor for club wiki pages.", scope: "Premium schools", enabled: true },
  { id: "flag_realtime_chat", name: "Realtime club channels", description: "Discord-style channels with live messaging.", scope: "All schools", enabled: false },
  { id: "flag_achievements", name: "Achievements & badges", description: "Award badges to students from the club roster.", scope: "Beta schools", enabled: false },
  { id: "flag_custom_domain", name: "Custom domains", description: "Let schools map their own domain to their workspace.", scope: "Premium schools", enabled: true },
  { id: "flag_district_rollup", name: "District rollup reporting", description: "Aggregate reporting across schools in the same district.", scope: "Platform admin only", enabled: false },
];

// ---------------------------------------------------------------------------
// School Dashboard (Phase 3): members, projects, kanban, tasks,
// calendar/events, resources, announcements — all scoped to mockSchool.
// ---------------------------------------------------------------------------

export type ClubMemberRole = "leader" | "member";
export type MemberStatus = "active" | "invited" | "suspended";

export type SchoolMember = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clubId: string | null;
  club: string | null;
  clubRole: ClubMemberRole | null;
  status: MemberStatus;
  joinedAt: string;
  avatarInitials: string;
};

const FIRST_NAMES = [
  "Adit", "Bella", "Citra", "Dimas", "Eka", "Fajar", "Gita", "Hana", "Indra", "Joko",
  "Kirana", "Lukman", "Maya", "Nadia", "Oscar", "Putri", "Qori", "Rangga", "Sari", "Tio",
  "Umar", "Vina", "Wawan", "Yuni", "Zaki", "Ayu", "Bagus", "Cindy", "Dwi", "Farah",
  "Galih", "Intan",
];
const LAST_NAMES = [
  "Wijaya", "Santoso", "Pratama", "Halim", "Kusuma", "Saputra", "Wibowo", "Utami",
  "Nugroho", "Setiawan", "Handayani", "Permadi", "Ramadhan", "Yulianto", "Kurniawan",
  "Anggraini", "Prasetyo", "Firmansyah", "Salsabila", "Hidayat",
];

function nameFor(i: number) {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length];
  return `${first} ${last}`;
}
function initialsFor(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
function emailFor(name: string) {
  return `${name.toLowerCase().replace(" ", ".")}@student.sman8jakarta.sch.id`;
}

// The two signed-in personas, plus the named club leader that the rest of the
// fixtures (announcements, resources, competitions) attribute content to.
const CORE_MEMBERS: SchoolMember[] = [
  { id: "u_admin", name: mockUsers.school_admin.name, email: mockUsers.school_admin.email, role: "school_admin", clubId: null, club: null, clubRole: null, status: "active", joinedAt: "2025-07-10", avatarInitials: mockUsers.school_admin.avatarInitials },
  { id: "u_lead", name: "Aditya Pratama", email: "aditya.pratama@student.sman8jakarta.sch.id", role: "student", clubId: "club_robotics", club: "Robotics Club", clubRole: "leader", status: "active", joinedAt: "2025-08-01", avatarInitials: "AP" },
  { id: "u_student", name: mockUsers.student.name, email: mockUsers.student.email, role: "student", clubId: "club_robotics", club: "Robotics Club", clubRole: "member", status: "active", joinedAt: "2025-08-20", avatarInitials: mockUsers.student.avatarInitials },
];

const STUDENT_COUNT = 34;
const GENERATED_STUDENTS: SchoolMember[] = Array.from({ length: STUDENT_COUNT }, (_, idx) => {
  const club = mockClubs[idx % mockClubs.length];
  const name = nameFor(idx + 7);
  const r = seededRandom(idx + 500);
  // First generated member of each club (other than Robotics, which already has
  // a named leader above) leads that club.
  const clubRole: ClubMemberRole = idx > 0 && idx < mockClubs.length ? "leader" : "member";
  const status: MemberStatus = r > 0.92 ? "invited" : r > 0.85 ? "suspended" : "active";
  return {
    id: `member_${idx + 1}`,
    name,
    email: emailFor(name),
    role: "student" as UserRole,
    clubId: club.id,
    club: club.name,
    clubRole,
    status,
    joinedAt: `2025-${String(8 + (idx % 4)).padStart(2, "0")}-${String(1 + (idx % 27)).padStart(2, "0")}`,
    avatarInitials: initialsFor(name),
  };
});

export const mockMembers: SchoolMember[] = [...CORE_MEMBERS, ...GENERATED_STUDENTS];

export const mockClubLeaders: SchoolMember[] = mockMembers.filter((m) => m.clubRole === "leader");

// --- Projects & Kanban -------------------------------------------------

export type ProjectStatus = "active" | "completed" | "archived";

export type MockProject = {
  id: string;
  clubId: string;
  clubName: string;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
};

export const mockProjects: MockProject[] = [
  { id: "proj_line_bot", clubId: "club_robotics", clubName: "Robotics Club", name: "Line-Following Robot v3", description: "Sensor-guided competition bot for the regional qualifier.", status: "active", dueDate: "2026-08-20" },
  { id: "proj_regional_bot", clubId: "club_robotics", clubName: "Robotics Club", name: "Regional Qualifier Bot", description: "Last season's competition entry, kept for reference builds.", status: "completed", dueDate: "2026-05-10" },
  { id: "proj_companion_app", clubId: "club_code", clubName: "Code Collective", name: "STEMORA Companion App", description: "A mobile companion app for club meeting schedules.", status: "active", dueDate: "2026-09-05" },
  { id: "proj_traffic", clubId: "club_code", clubName: "Code Collective", name: "Jakarta Traffic Predictor", description: "ML model predicting traffic near school during pickup hours.", status: "active", dueDate: "2026-10-01" },
  { id: "proj_water", clubId: "club_bio", clubName: "Bio Innovators", name: "Water Quality Sensor Array", description: "Low-cost sensor rig for testing river water near the school.", status: "active", dueDate: "2026-09-15" },
  { id: "proj_microplastics", clubId: "club_bio", clubName: "Bio Innovators", name: "Microplastics Survey", description: "Sampling survey of microplastics in local waterways.", status: "completed", dueDate: "2026-04-01" },
  { id: "proj_olympiad_bank", clubId: "club_math", clubName: "Math Olympiad Team", name: "Olympiad Problem Bank", description: "Shared bank of practice problems for the national olympiad.", status: "active", dueDate: "2026-08-30" },
];

export type BoardCardPriority = "low" | "medium" | "high";
export type BoardColumnId = "backlog" | "todo" | "in_progress" | "in_review" | "done";

export type BoardCard = {
  id: string;
  title: string;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  priority: BoardCardPriority;
  column: BoardColumnId;
};

export const BOARD_COLUMNS: { id: BoardColumnId; name: string }[] = [
  { id: "backlog", name: "Backlog" },
  { id: "todo", name: "To Do" },
  { id: "in_progress", name: "In Progress" },
  { id: "in_review", name: "In Review" },
  { id: "done", name: "Done" },
];

const TASK_VERBS = [
  "Design", "Prototype", "Test", "Document", "Calibrate", "Assemble", "Debug", "Present",
  "Research", "Review", "Refactor", "Wire up", "3D print", "Solder", "Benchmark", "Sketch",
];
const TASK_NOUNS = [
  "sensor mount", "chassis frame", "control loop", "battery pack", "wiring harness",
  "user interface", "data pipeline", "test rig", "presentation deck", "budget sheet",
  "motor driver", "camera module", "training set", "circuit board", "enclosure",
];

function membersForClub(clubId: string) {
  const roster = mockMembers.filter((m) => m.clubId === clubId);
  return roster.length ? roster : mockMembers.slice(0, 5);
}

export function getProjectBoard(projectId: string): Record<BoardColumnId, BoardCard[]> {
  const project = mockProjects.find((p) => p.id === projectId);
  const columns: Record<BoardColumnId, BoardCard[]> = {
    backlog: [], todo: [], in_progress: [], in_review: [], done: [],
  };
  if (!project) return columns;

  const roster = membersForClub(project.clubId);
  const cardCount = 10 + Math.floor(seededRandom(projectId.length * 13) * 6);

  for (let i = 0; i < cardCount; i++) {
    const seed = projectId.charCodeAt(0) + i * 17;
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 3);
    const r3 = seededRandom(seed + 9);
    const assignee = roster[i % roster.length];
    const columnIdx =
      project.status === "completed"
        ? 4
        : Math.min(4, Math.floor(r1 * (i < 3 ? 2 : 5)));
    const column = BOARD_COLUMNS[columnIdx].id;
    const verb = TASK_VERBS[Math.floor(r2 * TASK_VERBS.length)];
    const noun = TASK_NOUNS[Math.floor(r3 * TASK_NOUNS.length)];
    const priority: BoardCardPriority = r1 > 0.7 ? "high" : r1 > 0.35 ? "medium" : "low";
    const dueDay = 1 + Math.floor(r2 * 27);

    columns[column].push({
      id: `${projectId}_card_${i}`,
      title: `${verb} ${noun}`,
      assignee: assignee.name,
      assigneeInitials: assignee.avatarInitials,
      dueDate: `2026-08-${String(dueDay).padStart(2, "0")}`,
      priority,
      column,
    });
  }

  return columns;
}

// --- Announcements -------------------------------------------------------

export type Announcement = {
  id: string;
  title: string;
  body: string;
  club: string | null; // null = school-wide
  author: string;
  pinned: boolean;
  date: string;
};

export const mockAnnouncements: Announcement[] = [
  { id: "ann1", title: "Regional Qualifier is next Saturday", body: "Robotics Club — bring your bot and charged batteries by 7am. Bus leaves at 7:30 sharp.", club: "Robotics Club", author: "Aditya Pratama", pinned: true, date: "2026-08-01" },
  { id: "ann2", title: "New STEM club fair — sign up to table", body: "All clubs are invited to table at the September STEM fair. Reply in your club channel by Friday.", club: null, author: "Bu Rina Wijaya", pinned: true, date: "2026-07-30" },
  { id: "ann3", title: "Companion App design review", body: "We're reviewing the onboarding flow Thursday after school in Lab 3.", club: "Code Collective", author: "Bagus Anggraini", pinned: false, date: "2026-07-28" },
  { id: "ann4", title: "River sampling trip rescheduled", body: "Moved to next Wednesday due to weather — same meeting spot at the school gate.", club: "Bio Innovators", author: "Citra Halim", pinned: false, date: "2026-07-26" },
  { id: "ann5", title: "Olympiad practice sheet #12 posted", body: "Focus on combinatorics this week — solutions posted Friday.", club: "Math Olympiad Team", author: "Galih Kurniawan", pinned: false, date: "2026-07-24" },
  { id: "ann6", title: "Club leader nominations open", body: "Any active member can nominate a peer to lead their club next term — form in the announcement thread.", club: null, author: "Bu Rina Wijaya", pinned: false, date: "2026-07-20" },
];

// --- Calendar & events ----------------------------------------------------

export type SchoolEvent = {
  id: string;
  title: string;
  club: string | null;
  date: string; // ISO yyyy-mm-dd
  time: string;
  location: string;
  going: number;
  invited: number;
};

export const mockEvents: SchoolEvent[] = [
  { id: "ev1", title: "Regional Robotics Qualifier", club: "Robotics Club", date: "2026-08-08", time: "07:00", location: "Gelora Bung Karno Hall 3", going: 28, invited: 34 },
  { id: "ev2", title: "STEM Club Fair", club: null, date: "2026-08-14", time: "09:00", location: "School Courtyard", going: 140, invited: 727 },
  { id: "ev3", title: "Companion App design review", club: "Code Collective", date: "2026-08-06", time: "15:30", location: "Lab 3", going: 12, invited: 51 },
  { id: "ev4", title: "River water sampling trip", club: "Bio Innovators", date: "2026-08-05", time: "08:00", location: "Ciliwung River, Kalibata", going: 15, invited: 22 },
  { id: "ev5", title: "Math Olympiad practice session", club: "Math Olympiad Team", date: "2026-08-04", time: "16:00", location: "Room 214", going: 16, invited: 18 },
  { id: "ev6", title: "Club leader elections town hall", club: null, date: "2026-08-18", time: "12:30", location: "Auditorium", going: 64, invited: 727 },
];

// --- Resource library ------------------------------------------------------

export type ResourceType = "file" | "link";

export type Resource = {
  id: string;
  title: string;
  club: string | null;
  type: ResourceType;
  meta: string; // file size, or link host
  uploadedBy: string;
  date: string;
};

export const mockResources: Resource[] = [
  { id: "res1", title: "Sensor Calibration Guide.pdf", club: "Robotics Club", type: "file", meta: "2.4 MB", uploadedBy: "Aditya Pratama", date: "2026-07-29" },
  { id: "res2", title: "Regional Qualifier Rulebook 2026", club: "Robotics Club", type: "link", meta: "fbri.or.id", uploadedBy: "Aditya Pratama", date: "2026-07-20" },
  { id: "res3", title: "React Native Starter Kit.zip", club: "Code Collective", type: "file", meta: "18.1 MB", uploadedBy: "Bagus Anggraini", date: "2026-07-15" },
  { id: "res4", title: "Water Testing Protocol.docx", club: "Bio Innovators", type: "file", meta: "540 KB", uploadedBy: "Citra Halim", date: "2026-07-10" },
  { id: "res5", title: "AMC/AIME Problem Archive", club: "Math Olympiad Team", type: "link", meta: "artofproblemsolving.com", uploadedBy: "Galih Kurniawan", date: "2026-07-05" },
  { id: "res6", title: "Club Leader Handbook.pdf", club: null, type: "file", meta: "1.1 MB", uploadedBy: "Bu Rina Wijaya", date: "2026-06-28" },
  { id: "res7", title: "STEMORA Brand Kit", club: null, type: "link", meta: "stemora.com/brand", uploadedBy: "Bu Rina Wijaya", date: "2026-06-20" },
];

// ---------------------------------------------------------------------------
// Student Experience (Phase 4): profile, portfolio, achievements, skills,
// competitions, leaderboard, messaging, notifications — mostly keyed by
// member id so any member can eventually have a profile, not just the one
// mock student persona.
// ---------------------------------------------------------------------------

export type BadgeId =
  | "innovator"
  | "team_leader"
  | "researcher"
  | "programmer"
  | "engineer"
  | "champion"
  | "volunteer";

export type BadgeDef = { id: BadgeId; name: string; description: string };

export const BADGE_DEFS: BadgeDef[] = [
  { id: "innovator", name: "Innovator", description: "Shipped an original idea from concept to demo." },
  { id: "team_leader", name: "Team Leader", description: "Led a club or project team to completion." },
  { id: "researcher", name: "Researcher", description: "Ran a rigorous research or data-collection project." },
  { id: "programmer", name: "Programmer", description: "Wrote production-quality code for a real project." },
  { id: "engineer", name: "Engineer", description: "Designed and built a working physical system." },
  { id: "champion", name: "Champion", description: "Placed 1st at a competition." },
  { id: "volunteer", name: "Volunteer", description: "Gave back — coached peers or volunteered club hours." },
];

export type StudentAchievement = { badgeId: BadgeId; earnedAt: string; note?: string };

export const mockStudentAchievements: Record<string, StudentAchievement[]> = {
  u_student: [
    { badgeId: "programmer", earnedAt: "2026-03-12", note: "Line-Following Robot v2 firmware" },
    { badgeId: "engineer", earnedAt: "2026-04-20", note: "Chassis redesign for v3" },
    { badgeId: "champion", earnedAt: "2026-05-10", note: "Regional Qualifier — 1st place" },
    { badgeId: "team_leader", earnedAt: "2026-07-01", note: "Build Team Captain" },
  ],
  u_lead: [
    { badgeId: "team_leader", earnedAt: "2026-01-15" },
    { badgeId: "champion", earnedAt: "2026-05-10" },
    { badgeId: "volunteer", earnedAt: "2026-06-01" },
  ],
  member_1: [{ badgeId: "programmer", earnedAt: "2026-02-10" }],
  member_3: [{ badgeId: "researcher", earnedAt: "2026-03-01" }, { badgeId: "volunteer", earnedAt: "2026-04-01" }],
  member_5: [{ badgeId: "innovator", earnedAt: "2026-01-20" }],
  member_8: [{ badgeId: "engineer", earnedAt: "2026-02-15" }],
};

export type Skill = { name: string; level: number; category: string };

export const mockStudentSkills: Record<string, Skill[]> = {
  u_student: [
    { name: "Python", level: 4, category: "Programming" },
    { name: "Arduino / Embedded C", level: 4, category: "Programming" },
    { name: "CAD (Fusion 360)", level: 3, category: "Design" },
    { name: "Soldering", level: 5, category: "Hardware" },
    { name: "Public Speaking", level: 3, category: "Soft Skills" },
    { name: "Team Leadership", level: 4, category: "Soft Skills" },
  ],
};

export type Certificate = { id: string; title: string; issuer: string; date: string };

export const mockStudentCertificates: Record<string, Certificate[]> = {
  u_student: [
    { id: "cert1", title: "Introduction to Robotics", issuer: "Coursera", date: "2026-02-01" },
    { id: "cert2", title: "FIRST Robotics Safety Certification", issuer: "FIRST Indonesia", date: "2026-01-15" },
    { id: "cert3", title: "Arduino Fundamentals", issuer: "STEMORA Academy", date: "2025-11-20" },
  ],
};

export type LeadershipRole = { id: string; title: string; org: string; period: string; description: string };

export const mockStudentLeadership: Record<string, LeadershipRole[]> = {
  u_student: [
    {
      id: "lead1",
      title: "Build Team Captain",
      org: "Robotics Club",
      period: "Jul 2026 – Present",
      description: "Leading the 8-person build team for the regional qualifier bot, running weekly stand-ups and the build schedule.",
    },
    {
      id: "lead2",
      title: "Sensor Subteam Lead",
      org: "Robotics Club",
      period: "Jan 2026 – Jun 2026",
      description: "Owned the sensor calibration pipeline for the v2 competition bot.",
    },
  ],
};

export type StudentProfile = {
  memberId: string;
  handle: string;
  headline: string;
  about: string;
  location: string;
  links: { email: string; github?: string; linkedin?: string; website?: string };
};

export const mockStudentProfiles: Record<string, StudentProfile> = {
  u_student: {
    memberId: "u_student",
    handle: "sofia-kim",
    headline: "Build Team Captain @ Robotics Club · Regional Qualifier Champion",
    about:
      "I build competition robots and lead the sensor subteam at SMA Negeri 8 Jakarta's Robotics Club. Most interested in embedded systems and control loops — I want to study mechatronics engineering. Outside of robotics I run Arduino basics sessions for incoming freshmen.",
    location: "Jakarta Selatan, Indonesia",
    links: { email: "sofia.kim@student.sman8jakarta.sch.id", github: "github.com/sofiakim", linkedin: "linkedin.com/in/sofiakim", website: "sofiakim.dev" },
  },
};

// --- Competitions ----------------------------------------------------------

export type CompetitionStatus = "upcoming" | "ongoing" | "completed";
export type CompetitionLevel = "School" | "Regional" | "National" | "International";

export type Competition = {
  id: string;
  name: string;
  club: string;
  level: CompetitionLevel;
  date: string;
  status: CompetitionStatus;
  result?: string;
  participants: string[];
};

export const mockCompetitions: Competition[] = [
  { id: "comp1", name: "FBRI Regional Robotics Qualifier", club: "Robotics Club", level: "Regional", date: "2026-05-10", status: "completed", result: "1st Place", participants: ["Aditya Pratama", "Sofia Kim", "Hana Pratama"] },
  { id: "comp2", name: "National Robotics Championship", club: "Robotics Club", level: "National", date: "2026-08-08", status: "upcoming", participants: ["Aditya Pratama", "Sofia Kim", "Hana Pratama"] },
  { id: "comp3", name: "Indonesia Science Fair — Water Quality", club: "Bio Innovators", level: "National", date: "2026-04-01", status: "completed", result: "3rd Place", participants: ["Citra Halim", "Joko Nugroho"] },
  { id: "comp4", name: "ASEAN Coding Challenge", club: "Code Collective", level: "International", date: "2026-09-12", status: "upcoming", participants: ["Bagus Anggraini", "Indra Saputra"] },
  { id: "comp5", name: "Jakarta Math Olympiad", club: "Math Olympiad Team", level: "Regional", date: "2026-06-15", status: "completed", result: "Finalist", participants: ["Galih Kurniawan"] },
  { id: "comp6", name: "Hackathon Jakarta 2026", club: "Code Collective", level: "School", date: "2026-07-19", status: "completed", result: "2nd Place", participants: ["Bagus Anggraini"] },
  { id: "comp7", name: "National Science Olympiad", club: "Bio Innovators", level: "National", date: "2026-10-05", status: "upcoming", participants: ["Citra Halim"] },
  { id: "comp8", name: "City Robotics Scrimmage", club: "Robotics Club", level: "School", date: "2026-03-02", status: "completed", result: "1st Place", participants: ["Sofia Kim", "Putri Wibowo"] },
];

// --- Leaderboard ------------------------------------------------------------

export type LeaderboardEntry = {
  memberId: string;
  name: string;
  club: string | null;
  avatarInitials: string;
  points: number;
  badgeCount: number;
};

export const mockLeaderboard: LeaderboardEntry[] = mockMembers
  .filter((m) => m.role === "student")
  .map((m, i) => {
    const badgeCount = (mockStudentAchievements[m.id] ?? []).length;
    const base = Math.round(seededRandom(i + 700) * 500);
    return {
      memberId: m.id,
      name: m.name,
      club: m.club,
      avatarInitials: m.avatarInitials,
      points: base + badgeCount * 150 + (m.clubRole === "leader" ? 200 : 0),
      badgeCount,
    };
  })
  .sort((a, b) => b.points - a.points);

// --- Notifications (expanded, typed) ---------------------------------------

export type NotificationType = "grade" | "invite" | "mention" | "event" | "achievement" | "message";

export type FullNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const mockFullNotifications: FullNotification[] = [
  { id: "fn1", type: "achievement", title: "New badge earned", body: "You earned the Team Leader badge for Robotics Club.", time: "12m ago", unread: true },
  { id: "fn2", type: "grade", title: "Assignment graded", body: "Regional Qualifier Design Doc — 92/100", time: "2h ago", unread: true },
  { id: "fn3", type: "message", title: "New message from Aditya Pratama", body: "\"Can you check the sensor calibration numbers before Thursday?\"", time: "3h ago", unread: true },
  { id: "fn4", type: "event", title: "Event reminder", body: "Regional Robotics Qualifier is tomorrow at 07:00.", time: "5h ago", unread: false },
  { id: "fn5", type: "mention", title: "Mentioned in Companion App design review", body: "Bagus Anggraini mentioned you in a comment.", time: "1d ago", unread: false },
  { id: "fn6", type: "invite", title: "Aditya Pratama invited you", body: "Join Robotics Club as a member", time: "1d ago", unread: false },
  { id: "fn7", type: "achievement", title: "New badge earned", body: "You earned the Champion badge for placing 1st at the Regional Qualifier.", time: "3d ago", unread: false },
  { id: "fn8", type: "event", title: "New event", body: "STEM Club Fair added to the school calendar.", time: "5d ago", unread: false },
];

// --- Messaging ---------------------------------------------------------------

export type ConversationType = "dm" | "project" | "announcement";

export type ChatMessage = {
  id: string;
  author: string;
  authorInitials: string;
  body: string;
  time: string;
};

export type Conversation = {
  id: string;
  type: ConversationType;
  title: string;
  subtitle: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
};

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    type: "dm",
    title: "Aditya Pratama",
    subtitle: "Robotics Club Leader",
    lastMessage: "Can you check the sensor calibration numbers before Thursday?",
    lastTime: "3h ago",
    unread: 2,
    messages: [
      { id: "m1", author: "Aditya Pratama", authorInitials: "AP", body: "Hey! How's the sensor calibration going?", time: "10:02 AM" },
      { id: "m2", author: "Sofia Kim", authorInitials: "SK", body: "Almost done — getting some drift on sensor 3.", time: "10:05 AM" },
      { id: "m3", author: "Aditya Pratama", authorInitials: "AP", body: "Can you check the sensor calibration numbers before Thursday?", time: "10:07 AM" },
    ],
  },
  {
    id: "conv2",
    type: "dm",
    title: "Bu Rina Wijaya",
    subtitle: "School Admin",
    lastMessage: "Great work on the design doc — 92/100.",
    lastTime: "2h ago",
    unread: 0,
    messages: [
      { id: "m4", author: "Bu Rina Wijaya", authorInitials: "RW", body: "Great work on the design doc — 92/100.", time: "9:00 AM" },
      { id: "m5", author: "Sofia Kim", authorInitials: "SK", body: "Thank you, Bu! Appreciate the feedback on the wiring section.", time: "9:12 AM" },
    ],
  },
  {
    id: "conv3",
    type: "project",
    title: "Line-Following Robot v3",
    subtitle: "Robotics Club · 5 members",
    lastMessage: "Putri: pushed the new sensor mount STL to resources.",
    lastTime: "1h ago",
    unread: 1,
    messages: [
      { id: "m6", author: "Putri Wibowo", authorInitials: "PW", body: "Pushed the new sensor mount STL to resources.", time: "8:45 AM" },
      { id: "m7", author: "Hana Pratama", authorInitials: "HP", body: "Printing it tonight, should be ready by practice.", time: "8:50 AM" },
    ],
  },
  {
    id: "conv4",
    type: "project",
    title: "STEMORA Companion App",
    subtitle: "Code Collective · 4 members",
    lastMessage: "Bagus: onboarding flow review moved to Thursday.",
    lastTime: "1d ago",
    unread: 0,
    messages: [
      { id: "m8", author: "Bagus Anggraini", authorInitials: "BA", body: "Onboarding flow review moved to Thursday.", time: "Yesterday" },
    ],
  },
  {
    id: "conv5",
    type: "announcement",
    title: "Robotics Club",
    subtitle: "Club announcements",
    lastMessage: "Regional Qualifier is next Saturday — bring charged batteries.",
    lastTime: "1d ago",
    unread: 1,
    messages: [
      { id: "m9", author: "Aditya Pratama", authorInitials: "AP", body: "Regional Qualifier is next Saturday — bring charged batteries and be at the gate by 7am.", time: "Yesterday" },
    ],
  },
  {
    id: "conv6",
    type: "announcement",
    title: "SMA Negeri 8 Jakarta",
    subtitle: "School-wide announcements",
    lastMessage: "STEM Club Fair — sign up to table by Friday.",
    lastTime: "2d ago",
    unread: 0,
    messages: [
      { id: "m10", author: "Bu Rina Wijaya", authorInitials: "RW", body: "All clubs are invited to table at the September STEM fair.", time: "2 days ago" },
    ],
  },
];

// --- Public portfolio lookup -------------------------------------------------

export function getPublicProfileByHandle(handle: string) {
  const profile = Object.values(mockStudentProfiles).find((p) => p.handle === handle);
  if (!profile) return null;
  const member = mockMembers.find((m) => m.id === profile.memberId);
  if (!member) return null;
  return { profile, member };
}

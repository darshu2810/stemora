import type { UserRole } from "@/config/roles";

// Fixture data for building UI ahead of the backend. Shape mirrors the real
// schema in docs/architecture/database-schema.md so swapping in real Supabase
// queries later is a drop-in replacement, not a rewrite.
//
// The model is deliberately flat: one school runs exactly ONE STEM Club, and
// every student, project, competition, resource, announcement, and event
// belongs directly to that club. There is no club table and no club id —
// subject areas exist only as PROJECT_CATEGORIES on a project.
//
// The pilot tenant is the GMIS STEM Club at GMIS Jakarta. Every person and
// every result below is fictional and exists only to make the demo legible.

// Fixture data is anchored to this term rather than the wall clock, so the
// demo reads the same on any day. One constant, used everywhere a view needs
// to know what counts as "upcoming".
export const DEMO_TODAY = "2026-08-03";

export type MockUser = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarInitials: string;
};

export const mockSchool = {
  id: "school_gmis",
  name: "GMIS Jakarta",
  slug: "gmis-jakarta",
  district: "Jakarta Timur",
  clubName: "GMIS STEM Club",
  term: "Term 1 · 2026/27",
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
    name: "Ms. Priya Menon",
    role: "school_admin",
    email: "priya.menon@gmis.sch.id",
    avatarInitials: "PM",
  },
  student: {
    id: "u_student",
    name: "Anaya Kapoor",
    role: "student",
    email: "anaya.kapoor@student.gmis.sch.id",
    avatarInitials: "AK",
  },
};

// --- Project categories -----------------------------------------------------
// Subject areas are an attribute of a project, never a group students join.

export type ProjectCategory =
  | "Robotics"
  | "Programming"
  | "Artificial Intelligence"
  | "Engineering"
  | "Electronics"
  | "Mathematics"
  | "Research"
  | "Physics"
  | "Environmental Science";

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Robotics",
  "Programming",
  "Artificial Intelligence",
  "Engineering",
  "Electronics",
  "Mathematics",
  "Research",
  "Physics",
  "Environmental Science",
];

// --- Students ---------------------------------------------------------------

export type StudentStatus = "active" | "invited";

export type Student = {
  id: string;
  name: string;
  email: string;
  grade: number; // GMIS STEM Club runs across Grades 8–12.
  status: StudentStatus;
  joinedAt: string;
  avatarInitials: string;
};

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function emailFor(name: string) {
  const handle = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");
  return `${handle}@student.gmis.sch.id`;
}

type StudentSeed = [id: string, name: string, grade: number, joinedAt: string, status?: StudentStatus];

// 36 fictional students across Grades 8–12. `u_student` is the signed-in
// student persona; the three `invited` rows are this term's pending
// applications.
const STUDENT_SEEDS: StudentSeed[] = [
  ["s_rohan", "Rohan Gupta", 12, "2025-08-04"],
  ["u_student", "Anaya Kapoor", 11, "2025-08-11"],
  ["s_kevin", "Kevin Tanuwijaya", 12, "2025-08-04"],
  ["s_ishaan", "Ishaan Mehra", 10, "2025-09-02"],
  ["s_clara", "Clara Wijaya", 11, "2025-08-18"],
  ["s_daniel", "Daniel Setiawan", 9, "2026-01-12"],
  ["s_riko", "Riko Tanaka", 10, "2025-10-06"],
  ["s_amara", "Amara Okonkwo", 8, "2026-01-12"],
  ["s_vivaan", "Vivaan Nair", 12, "2025-08-04"],
  ["s_jiahui", "Jia-Hui Lim", 11, "2025-08-11"],
  ["s_rafael", "Rafael Santoso", 10, "2025-09-15"],
  ["s_sanya", "Sanya Bhatt", 11, "2025-08-25"],
  ["s_ethan", "Ethan Park", 12, "2025-08-04"],
  ["s_nabila", "Nabila Hartono", 9, "2026-01-19"],
  ["s_arjun", "Arjun Iyer", 10, "2025-11-03"],
  ["s_meiling", "Mei Ling Chen", 8, "2026-07-27", "invited"],
  ["s_kiara", "Kiara Dsouza", 12, "2025-08-04"],
  ["s_bimo", "Bimo Prakoso", 11, "2025-08-18"],
  ["s_aditi", "Aditi Raghavan", 10, "2025-09-08"],
  ["s_joshua", "Joshua Tanoto", 9, "2026-01-12"],
  ["s_hana", "Hana Sugiarto", 11, "2025-08-25"],
  ["s_yusuf", "Yusuf Alatas", 12, "2025-08-11"],
  ["s_elena", "Elena Kusumo", 8, "2026-02-02"],
  ["s_dhruv", "Dhruv Malhotra", 12, "2025-08-04"],
  ["s_sekar", "Sekar Ayuningtyas", 11, "2025-08-18"],
  ["s_nathan", "Nathan Wibisono", 10, "2025-10-13"],
  ["s_priyanka", "Priyanka Deshmukh", 12, "2025-08-11"],
  ["s_farrel", "Farrel Hidayat", 9, "2026-01-26"],
  ["s_ayla", "Ayla Kurniawan", 10, "2025-11-10"],
  ["s_tomas", "Tomas Bergstrom", 11, "2026-07-27", "invited"],
  ["s_meera", "Meera Krishnan", 12, "2025-08-04"],
  ["s_bastian", "Bastian Halim", 11, "2025-08-25"],
  ["s_yerin", "Yerin Cho", 10, "2025-09-22"],
  ["s_rania", "Rania Firdaus", 9, "2026-01-19"],
  ["s_krish", "Krish Patel", 12, "2025-08-11"],
  ["s_laras", "Laras Wibowo", 8, "2026-07-27", "invited"],
];

export const mockStudents: Student[] = STUDENT_SEEDS.map(([id, name, grade, joinedAt, status]) => ({
  id,
  name,
  email: emailFor(name),
  grade,
  status: status ?? "active",
  joinedAt,
  avatarInitials: initialsFor(name),
}));

export function studentById(id: string): Student | undefined {
  return mockStudents.find((s) => s.id === id);
}

export function studentName(id: string): string {
  return studentById(id)?.name ?? "Unassigned";
}

export const GRADES: number[] = [...new Set(mockStudents.map((s) => s.grade))].sort((a, b) => a - b);

// --- Projects ---------------------------------------------------------------

export type ProjectStatus = "active" | "completed";

export type MockProject = {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  status: ProjectStatus;
  startedAt: string;
  dueDate: string;
  // A project leader is an attribute of the project, not a system role — the
  // student still signs in as a Student like everyone else.
  leaderId: string;
  memberIds: string[];
};

export const mockProjects: MockProject[] = [
  {
    id: "proj_autonomous_robot",
    name: "Autonomous Robot",
    category: "Robotics",
    description:
      "Infrared-guided robot that runs the inter-school time-trial track without leaving the line. Retuning the control loop after the switch to a five-sensor array.",
    status: "active",
    startedAt: "2026-02-09",
    dueDate: "2026-09-12",
    leaderId: "s_rohan",
    memberIds: ["s_rohan", "u_student", "s_kevin", "s_ishaan", "s_clara", "s_daniel"],
  },
  {
    id: "proj_drone_mapping",
    name: "Drone Mapping",
    category: "Robotics",
    description:
      "A camera drone that flies a fixed route over the school field and stitches the frames into a single top-down map of the campus.",
    status: "active",
    startedAt: "2026-04-20",
    dueDate: "2026-10-24",
    leaderId: "s_kevin",
    memberIds: ["s_kevin", "u_student", "s_riko", "s_amara", "s_nathan"],
  },
  {
    id: "proj_waste_ai",
    name: "AI Waste Classification",
    category: "Artificial Intelligence",
    description:
      "An image classifier that sorts canteen waste into organic, plastic, paper, and metal from a webcam feed, trained on photos taken around campus.",
    status: "active",
    startedAt: "2026-03-02",
    dueDate: "2026-09-30",
    leaderId: "s_vivaan",
    memberIds: ["s_vivaan", "s_sanya", "s_jiahui", "s_arjun", "s_rafael"],
  },
  {
    id: "proj_attendance_portal",
    name: "Attendance Portal",
    category: "Programming",
    description:
      "A QR check-in tool for the weekly STEM Club meeting, built in Python and now used at every session.",
    status: "completed",
    startedAt: "2026-01-19",
    dueDate: "2026-05-22",
    leaderId: "s_ethan",
    memberIds: ["s_ethan", "s_vivaan", "s_nabila", "s_rafael"],
  },
  {
    id: "proj_solar_tracking",
    name: "Solar Tracking System",
    category: "Electronics",
    description:
      "A dual-axis panel mount that follows the sun using light-dependent resistors and two servos, logging output against a fixed reference panel.",
    status: "active",
    startedAt: "2026-03-16",
    dueDate: "2026-09-19",
    leaderId: "s_kiara",
    memberIds: ["s_kiara", "s_bimo", "s_aditi", "s_joshua", "s_hana"],
  },
  {
    id: "proj_weather_station",
    name: "IoT Weather Station",
    category: "Electronics",
    description:
      "A rooftop station logging temperature, humidity, rainfall, and air quality to a live dashboard — running continuously since March.",
    status: "completed",
    startedAt: "2026-02-02",
    dueDate: "2026-06-06",
    leaderId: "s_yusuf",
    memberIds: ["s_yusuf", "s_kiara", "s_elena", "s_bimo"],
  },
  {
    id: "proj_smart_irrigation",
    name: "Smart Irrigation",
    category: "Environmental Science",
    description:
      "Moisture-triggered watering for the school garden beds, with a phone alert when the tank runs low.",
    status: "active",
    startedAt: "2026-04-06",
    dueDate: "2026-10-10",
    leaderId: "s_hana",
    memberIds: ["s_hana", "s_aditi", "s_joshua", "u_student", "s_farrel", "s_rania"],
  },
  {
    id: "proj_bridge_challenge",
    name: "Bridge Engineering Challenge",
    category: "Engineering",
    description:
      "Balsa-wood truss bridges tested to failure on a load rig, entered in the inter-school bridge-building challenge.",
    status: "active",
    startedAt: "2026-05-11",
    dueDate: "2026-11-07",
    leaderId: "s_dhruv",
    memberIds: ["s_dhruv", "s_sekar", "s_nathan", "s_farrel", "s_ayla"],
  },
  {
    id: "proj_hologram",
    name: "Pepper's Ghost Hologram",
    category: "Physics",
    description:
      "An acrylic pyramid display that projects a rotating 3D model, built for the STEM booth at Open Day.",
    status: "completed",
    startedAt: "2026-02-16",
    dueDate: "2026-05-15",
    leaderId: "s_priyanka",
    memberIds: ["s_priyanka", "s_sekar", "s_ayla", "s_elena"],
  },
  {
    id: "proj_paper_repository",
    name: "Research Paper Repository",
    category: "Research",
    description:
      "A searchable archive of every write-up, poster, and dataset the STEM Club has produced, so next year's members start from what already exists.",
    status: "active",
    startedAt: "2026-04-27",
    dueDate: "2026-09-26",
    leaderId: "s_meera",
    memberIds: ["s_meera", "s_bastian", "s_krish", "s_yerin"],
  },
  {
    id: "proj_air_quality",
    name: "Air Quality Data Study",
    category: "Mathematics",
    description:
      "A term-long statistical study of PM2.5 readings at three East Jakarta locations, written up for the science fair.",
    status: "active",
    startedAt: "2026-03-23",
    dueDate: "2026-10-03",
    leaderId: "s_bastian",
    memberIds: ["s_bastian", "s_meera", "s_yerin", "s_rania", "s_krish"],
  },
];

export function projectById(id: string): MockProject | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function projectsForStudent(studentId: string): MockProject[] {
  return mockProjects.filter((p) => p.memberIds.includes(studentId));
}

// --- Tasks (project boards) -------------------------------------------------

export type BoardCardPriority = "low" | "medium" | "high";
export type BoardColumnId = "backlog" | "todo" | "in_progress" | "in_review" | "done";

export type BoardCard = {
  id: string;
  title: string;
  assigneeId: string;
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

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Real task lists per project, so a board reads like something the club
// actually worked through rather than randomly paired verbs and nouns.
const PROJECT_TASKS: Record<string, string[]> = {
  proj_autonomous_robot: [
    "Solder the five-sensor IR array",
    "Mount the sensor bar 8mm above the track",
    "Wire the motor driver to the Arduino Nano",
    "Write the sensor calibration routine",
    "Tune the control loop on the practice track",
    "Cut and drill the new chassis plate",
    "Design a 3D-printed sensor bracket",
    "Log lap times across three gain settings",
    "Fix the wobble on the left wheel mount",
    "Test battery life over 20 laps",
    "Update the wiring diagram in the resource library",
    "Record a demo video for the showcase",
  ],
  proj_drone_mapping: [
    "Assemble the quadcopter frame",
    "Balance and mount the propellers",
    "Configure the flight controller firmware",
    "Calibrate the compass and IMU",
    "Write the pre-flight safety checklist",
    "Get flight permission from the head of school",
    "Plan the survey route over the field",
    "Mount the camera gimbal",
    "Run a tethered hover test",
    "Capture the first photo set",
    "Stitch the images into a test map",
  ],
  proj_waste_ai: [
    "Photograph 500 canteen waste samples",
    "Label the dataset into four classes",
    "Split train, validation, and test sets",
    "Train the baseline model",
    "Compare accuracy against MobileNet",
    "Build the webcam capture script",
    "Handle the unknown-object case",
    "Test the model under canteen lighting",
    "Write up the confusion matrix",
    "Design the sorting bin overlay",
    "Draft the science fair abstract",
  ],
  proj_attendance_portal: [
    "Design the QR check-in flow",
    "Build the student lookup table",
    "Print student QR cards",
    "Fix duplicate scans within one minute",
    "Write the weekly attendance export",
    "Test check-in with 30 students",
    "Document the setup steps",
    "Hand the tool over to the School Admin",
  ],
  proj_solar_tracking: [
    "Build the dual-axis servo mount",
    "Wire the four LDR voltage dividers",
    "Write the sun-tracking algorithm",
    "3D print the panel bracket",
    "Add end-stops to protect the servos",
    "Log output against a fixed panel for a week",
    "Weatherproof the control box",
    "Chart the efficiency gain",
    "Order a replacement 6V panel",
    "Present the findings at the weekly meeting",
  ],
  proj_weather_station: [
    "Assemble the Stevenson screen",
    "Mount the anemometer on the roof",
    "Connect the PM2.5 sensor",
    "Push readings to the dashboard every 5 minutes",
    "Validate readings against the BMKG station",
    "Build the public dashboard page",
    "Write the deployment report",
    "Hand monitoring over to the Grade 10 team",
  ],
  proj_smart_irrigation: [
    "Calibrate the capacitive soil sensors",
    "Plumb the drip line to garden bed 3",
    "Wire the relay to the 12V pump",
    "Set moisture thresholds per plant type",
    "Add the low-tank float switch",
    "Build the low-water alert",
    "Weatherproof the outdoor enclosure",
    "Run a seven-day unattended test",
    "Measure water saved against manual watering",
    "Write the maintenance guide for the gardener",
  ],
  proj_bridge_challenge: [
    "Study last year's truss designs",
    "Model the Pratt truss in Fusion 360",
    "Build the load-testing rig",
    "Test joint glue strength",
    "Cut balsa members to length",
    "Record load-to-failure for prototype 1",
    "Bring the deck mass under 25g",
    "Register the team for the challenge",
    "Prepare the design justification report",
    "Build the competition bridge",
  ],
  proj_hologram: [
    "Cut the acrylic pyramid panels",
    "Polish and bond the seams",
    "Model the rotating molecule animation",
    "Build the blackout box for the booth",
    "Test viewing angles under hall lighting",
    "Write the visitor explainer card",
    "Run the booth on Open Day",
    "Pack and store the rig",
  ],
  proj_paper_repository: [
    "Collect every write-up from the last two terms",
    "Agree the metadata fields for each entry",
    "Scan the 2025 science fair posters",
    "Build the search and filter page",
    "Add the upload form for new papers",
    "Write the submission guidelines",
    "Migrate the existing drive folder",
    "Review entries for missing authors",
    "Publish the archive to the club",
  ],
  proj_air_quality: [
    "Choose the three sampling locations",
    "Borrow the PM2.5 meters from the lab",
    "Set the daily sampling schedule",
    "Enter the week 1–4 readings",
    "Clean the data and check for outliers",
    "Run the comparison across locations",
    "Plot weekday against weekend readings",
    "Draft the methodology section",
    "Peer-review with the Grade 12 team",
    "Format the science fair poster",
  ],
};

function daysBetween(from: string, to: string) {
  return (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000;
}

function addDays(from: string, days: number) {
  const d = new Date(`${from}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + Math.round(days));
  return d.toISOString().slice(0, 10);
}

/**
 * A project's board, derived rather than hand-written so the numbers can never
 * contradict each other.
 *
 * Task lists are written in the order the club works through them, so tasks
 * are spread evenly between the start date and the deadline, and a project
 * that is 60% of the way through its schedule has roughly its first 60% of
 * tasks done. A finished project is entirely done. That keeps every progress
 * bar, "N/M tasks done" count, and pending-task list honest.
 */
export function getProjectBoard(projectId: string): Record<BoardColumnId, BoardCard[]> {
  const project = projectById(projectId);
  const columns: Record<BoardColumnId, BoardCard[]> = {
    backlog: [], todo: [], in_progress: [], in_review: [], done: [],
  };
  if (!project) return columns;

  const roster = project.memberIds;
  const titles = PROJECT_TASKS[projectId] ?? [];
  const span = Math.max(1, daysBetween(project.startedAt, project.dueDate));
  const elapsed = Math.min(1, Math.max(0, daysBetween(project.startedAt, DEMO_TODAY) / span));

  // Real teams run a little behind a purely linear burn-down, so a project 80%
  // through its schedule is about 64% done rather than exactly 80%.
  const doneCount =
    project.status === "completed" ? titles.length : Math.round(elapsed * 0.8 * titles.length);
  const remaining = titles.length - doneCount;
  // Whatever is left sits closest-to-finished first: one item in review, then
  // the rest split evenly across in progress, queued, and the backlog.
  const reviewCount = Math.min(1, remaining);
  const rest = remaining - reviewCount;
  const inProgressCount = Math.floor(rest / 3);
  const todoCount = Math.floor(rest / 3);

  titles.forEach((title, i) => {
    const assigneeId = roster[i % roster.length];
    const assignee = studentById(assigneeId);

    const offset = i - doneCount;
    const column: BoardColumnId =
      offset < 0
        ? "done"
        : offset < reviewCount
          ? "in_review"
          : offset < reviewCount + inProgressCount
            ? "in_progress"
            : offset < reviewCount + inProgressCount + todoCount
              ? "todo"
              : "backlog";

    columns[column].push({
      id: `${projectId}_task_${i}`,
      title,
      assigneeId,
      assignee: assignee?.name ?? "Unassigned",
      assigneeInitials: assignee?.avatarInitials ?? "—",
      dueDate: addDays(project.startedAt, ((i + 1) / titles.length) * span),
      priority: seededRandom(projectId.length * 13 + i * 17) > 0.7 ? "high" : offset < todoCount ? "medium" : "low",
      column,
    });
  });

  return columns;
}

export function getProjectProgress(projectId: string): { done: number; total: number; percent: number } {
  const board = getProjectBoard(projectId);
  const total = BOARD_COLUMNS.reduce((sum, c) => sum + board[c.id].length, 0);
  const done = board.done.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

export type OpenTask = BoardCard & { projectId: string; projectName: string };

/** Every unfinished task on every board, earliest deadline first. */
export function openTasks(): OpenTask[] {
  return mockProjects
    .flatMap((project) => {
      const board = getProjectBoard(project.id);
      return BOARD_COLUMNS.filter((c) => c.id !== "done").flatMap((col) =>
        board[col.id].map((card) => ({ ...card, projectId: project.id, projectName: project.name })),
      );
    })
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
}

/** Every task on every board assigned to one student, open work first. */
export function tasksForStudent(studentId: string): OpenTask[] {
  return mockProjects
    .flatMap((project) => {
      const board = getProjectBoard(project.id);
      return BOARD_COLUMNS.flatMap((col) =>
        board[col.id]
          .filter((card) => card.assigneeId === studentId)
          .map((card) => ({ ...card, projectId: project.id, projectName: project.name })),
      );
    })
    .sort(
      (a, b) =>
        Number(a.column === "done") - Number(b.column === "done") ||
        (a.dueDate < b.dueDate ? -1 : 1),
    );
}

// --- Announcements ----------------------------------------------------------

export type Announcement = {
  id: string;
  title: string;
  body: string;
  author: string;
  pinned: boolean;
  date: string;
};

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann1",
    title: "Project proposal submission deadline extended",
    body: "You now have until 15 August to submit your term project proposal. One page is enough — the problem, your approach, and anything you need from the lab budget.",
    author: "Ms. Priya Menon",
    pinned: true,
    date: "2026-08-01",
  },
  {
    id: "ann2",
    title: "Workshop registration opens: Sensors & Motor Drivers",
    body: "Friday 7 August, 14:00 in the Robotics Lab. Twenty places. Bring a laptop with the Arduino IDE already installed — we start wiring straight away.",
    author: "Rohan Gupta",
    pinned: true,
    date: "2026-07-31",
  },
  {
    id: "ann3",
    title: "STEM Club applications are now open",
    body: "Grades 8 to 12 can apply to join the GMIS STEM Club until Friday. Tell us which kind of project you want to work on — robotics, programming, electronics, engineering, or research.",
    author: "Ms. Priya Menon",
    pinned: true,
    date: "2026-07-28",
  },
  {
    id: "ann4",
    title: "Science Fair registration closes next week",
    body: "Teams entering the Jakarta Inter-School Science Fair must register by 8 August. Talk to your project leader if you still need a teammate.",
    author: "Ms. Priya Menon",
    pinned: false,
    date: "2026-07-25",
  },
  {
    id: "ann5",
    title: "Arduino kits available from the lab store",
    body: "Twenty starter kits are in the Science Block store cupboard. Sign one out in the logbook and return it at the end of term.",
    author: "Kiara Dsouza",
    pinned: false,
    date: "2026-07-22",
  },
  {
    id: "ann6",
    title: "Weekly STEM meeting moves to Lab 2",
    body: "From this week the Wednesday 15:30 meeting runs in Science Block Lab 2 instead of the library. Same time, more bench space.",
    author: "Ms. Priya Menon",
    pinned: false,
    date: "2026-07-20",
  },
  {
    id: "ann7",
    title: "Competition deadline: Inter-school STEM Competition roster",
    body: "Confirm your place on the 6 September roster by 20 August. Fourteen places, first come first served, and you must have attended two workshops.",
    author: "Ms. Priya Menon",
    pinned: false,
    date: "2026-07-18",
  },
  {
    id: "ann8",
    title: "Internal Project Showcase — 28 August",
    body: "Every project team presents in the School Hall at 13:00. Ten minutes each, one working demo, and a poster. Presentation slots go up next week.",
    author: "Ms. Priya Menon",
    pinned: false,
    date: "2026-07-15",
  },
];

// --- Events -----------------------------------------------------------------

export type EventType = "Meeting" | "Workshop" | "Competition" | "Showcase";

export type StemEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO yyyy-mm-dd
  time: string;
  location: string;
  going: number;
};

export const EVENT_TYPES: EventType[] = ["Meeting", "Workshop", "Competition", "Showcase"];

export const mockEvents: StemEvent[] = [
  { id: "ev1", title: "Open Day STEM Booth", type: "Showcase", date: "2026-07-11", time: "09:00", location: "School Courtyard", going: 31 },
  { id: "ev2", title: "Term 1 Kick-off Meeting", type: "Meeting", date: "2026-07-22", time: "15:30", location: "Science Block, Lab 2", going: 30 },
  { id: "ev3", title: "Weekly STEM Club Meeting", type: "Meeting", date: "2026-07-29", time: "15:30", location: "Science Block, Lab 2", going: 28 },
  { id: "ev4", title: "Weekly STEM Club Meeting", type: "Meeting", date: "2026-08-05", time: "15:30", location: "Science Block, Lab 2", going: 29 },
  { id: "ev5", title: "Robotics Workshop: Sensors & Motor Drivers", type: "Workshop", date: "2026-08-07", time: "14:00", location: "Robotics Lab", going: 20 },
  { id: "ev6", title: "Arduino Bootcamp — Day 1", type: "Workshop", date: "2026-08-14", time: "09:00", location: "Computer Lab 1", going: 20 },
  { id: "ev7", title: "Arduino Bootcamp — Day 2", type: "Workshop", date: "2026-08-15", time: "09:00", location: "Computer Lab 1", going: 19 },
  { id: "ev8", title: "Science Fair Preparation Session", type: "Workshop", date: "2026-08-19", time: "15:30", location: "Science Block, Lab 2", going: 22 },
  { id: "ev9", title: "Internal Project Showcase", type: "Showcase", date: "2026-08-28", time: "13:00", location: "School Hall", going: 32 },
  { id: "ev10", title: "Inter-school STEM Competition", type: "Competition", date: "2026-09-06", time: "07:30", location: "Jakarta Convention Center, Senayan", going: 14 },
];

export function upcomingEvents(): StemEvent[] {
  return mockEvents.filter((e) => e.date >= DEMO_TODAY).sort((a, b) => (a.date < b.date ? -1 : 1));
}

// --- Resource library -------------------------------------------------------

export type ResourceType = "file" | "link";
export type ResourceCategory = ProjectCategory | "General";

export const RESOURCE_CATEGORIES: ResourceCategory[] = ["General", ...PROJECT_CATEGORIES];

export type Resource = {
  id: string;
  title: string;
  category: ResourceCategory;
  type: ResourceType;
  meta: string; // file size, or link host
  uploadedBy: string;
  date: string;
};

export const mockResources: Resource[] = [
  { id: "res1", title: "Autonomous Robot Wiring Diagram.png", category: "Robotics", type: "file", meta: "820 KB", uploadedBy: "Rohan Gupta", date: "2026-07-27" },
  { id: "res2", title: "Arduino Beginner Guide.pdf", category: "Electronics", type: "file", meta: "3.1 MB", uploadedBy: "Kiara Dsouza", date: "2026-07-24" },
  { id: "res3", title: "Inter-school STEM Competition Rulebook 2026.pdf", category: "General", type: "file", meta: "1.6 MB", uploadedBy: "Ms. Priya Menon", date: "2026-07-21" },
  { id: "res4", title: "Python Programming Notes.pdf", category: "Programming", type: "file", meta: "1.8 MB", uploadedBy: "Vivaan Nair", date: "2026-07-19" },
  { id: "res5", title: "CAD Design Basics — Fusion 360 for Students", category: "Engineering", type: "link", meta: "autodesk.com", uploadedBy: "Dhruv Malhotra", date: "2026-07-16" },
  { id: "res6", title: "Electronics Handbook.pdf", category: "Electronics", type: "file", meta: "5.4 MB", uploadedBy: "Kiara Dsouza", date: "2026-07-12" },
  { id: "res7", title: "STEM Project Planning Template.docx", category: "General", type: "file", meta: "240 KB", uploadedBy: "Ms. Priya Menon", date: "2026-07-08" },
  { id: "res8", title: "Statistics for Science Fair Projects.pdf", category: "Mathematics", type: "file", meta: "2.2 MB", uploadedBy: "Meera Krishnan", date: "2026-07-06" },
  { id: "res9", title: "GMIS STEM Club Handbook.pdf", category: "General", type: "file", meta: "1.2 MB", uploadedBy: "Ms. Priya Menon", date: "2026-07-04" },
  { id: "res10", title: "Science Fair Judging Criteria.pdf", category: "Research", type: "file", meta: "410 KB", uploadedBy: "Ms. Priya Menon", date: "2026-07-02" },
  { id: "res11", title: "Optics Notes — Reflection & Refraction.pdf", category: "Physics", type: "file", meta: "1.4 MB", uploadedBy: "Priyanka Deshmukh", date: "2026-06-30" },
  { id: "res12", title: "scikit-learn Classification Tutorial", category: "Artificial Intelligence", type: "link", meta: "scikit-learn.org", uploadedBy: "Sanya Bhatt", date: "2026-06-26" },
  { id: "res13", title: "Soil Moisture Sensor Datasheet.pdf", category: "Environmental Science", type: "file", meta: "680 KB", uploadedBy: "Hana Sugiarto", date: "2026-06-22" },
];

// --- Competitions -----------------------------------------------------------

export type CompetitionStatus = "upcoming" | "completed";
export type CompetitionLevel = "School" | "Regional" | "National" | "International";

export type Competition = {
  id: string;
  name: string;
  category: ProjectCategory;
  level: CompetitionLevel;
  date: string;
  status: CompetitionStatus;
  result?: string;
  podium: boolean;
  participantIds: string[];
};

export const COMPETITION_LEVELS: CompetitionLevel[] = ["School", "Regional", "National", "International"];

export const mockCompetitions: Competition[] = [
  { id: "comp1", name: "Indonesia Robotics Olympiad — Jakarta Regional", category: "Robotics", level: "Regional", date: "2026-05-09", status: "completed", result: "Regional finalist", podium: false, participantIds: ["s_rohan", "u_student", "s_kevin"] },
  { id: "comp2", name: "National Science Project Olympiad", category: "Research", level: "National", date: "2026-04-25", status: "completed", result: "1st place — data science category", podium: true, participantIds: ["s_meera", "s_rania"] },
  { id: "comp3", name: "Jakarta Schools Hackathon", category: "Programming", level: "Regional", date: "2026-03-21", status: "completed", result: "2nd place", podium: true, participantIds: ["s_vivaan", "s_jiahui", "s_arjun"] },
  { id: "comp4", name: "National Electronics Design Contest", category: "Electronics", level: "National", date: "2026-06-13", status: "completed", result: "Best Engineering Design award", podium: false, participantIds: ["s_kiara", "s_aditi", "s_yusuf"] },
  { id: "comp5", name: "Jakarta Inter-School Science Fair", category: "Environmental Science", level: "Regional", date: "2026-08-22", status: "upcoming", podium: false, participantIds: ["s_meera", "s_bastian", "s_yerin"] },
  { id: "comp6", name: "Internal Project Showcase", category: "Engineering", level: "School", date: "2026-08-28", status: "upcoming", podium: false, participantIds: ["s_dhruv", "s_sekar", "s_priyanka"] },
  { id: "comp7", name: "World Robot Olympiad — Indonesia Qualifier", category: "Robotics", level: "National", date: "2026-09-06", status: "upcoming", podium: false, participantIds: ["s_rohan", "u_student", "s_ishaan", "s_clara"] },
  { id: "comp8", name: "ASEAN Youth Innovation Challenge", category: "Artificial Intelligence", level: "International", date: "2026-10-18", status: "upcoming", podium: false, participantIds: ["s_vivaan", "s_sanya", "s_ethan"] },
  { id: "comp9", name: "Inter-school Bridge Building Challenge", category: "Engineering", level: "Regional", date: "2026-11-14", status: "upcoming", podium: false, participantIds: ["s_dhruv", "s_nathan", "s_farrel"] },
];

// --- Achievements -----------------------------------------------------------

export type BadgeId =
  | "innovation"
  | "leadership"
  | "science_fair"
  | "programmer"
  | "engineering"
  | "robotics_finalist"
  | "peer_coach";

export type BadgeDef = { id: BadgeId; name: string; description: string };

export const BADGE_DEFS: BadgeDef[] = [
  { id: "innovation", name: "Innovation Award", description: "Took an original idea from sketch to a working demo." },
  { id: "leadership", name: "STEM Leadership Award", description: "Led a project team through a full term." },
  { id: "science_fair", name: "Science Fair Winner", description: "Placed first at a school or inter-school science fair." },
  { id: "programmer", name: "Outstanding Programmer", description: "Wrote and shipped the code behind a club project." },
  { id: "engineering", name: "Best Engineering Design", description: "Designed and built a physical system that works end to end." },
  { id: "robotics_finalist", name: "Robotics Competition Finalist", description: "Reached the finals of a robotics competition." },
  { id: "peer_coach", name: "Peer Coach", description: "Ran sessions to bring newer members up to speed." },
];

export type StudentAchievement = { badgeId: BadgeId; earnedAt: string; note?: string };

export const mockAchievements: Record<string, StudentAchievement[]> = {
  u_student: [
    { badgeId: "programmer", earnedAt: "2026-03-06", note: "Autonomous Robot firmware and calibration routine" },
    { badgeId: "engineering", earnedAt: "2026-04-17", note: "Five-sensor array and bracket redesign" },
    { badgeId: "robotics_finalist", earnedAt: "2026-05-09", note: "Indonesia Robotics Olympiad — Jakarta regional" },
    { badgeId: "peer_coach", earnedAt: "2026-06-12", note: "Ran the Grade 8 Arduino starter sessions" },
  ],
  s_rohan: [
    { badgeId: "leadership", earnedAt: "2025-09-01", note: "Project leader, Autonomous Robot" },
    { badgeId: "engineering", earnedAt: "2026-02-20" },
    { badgeId: "robotics_finalist", earnedAt: "2026-05-09" },
  ],
  s_vivaan: [
    { badgeId: "leadership", earnedAt: "2025-09-01", note: "Project leader, AI Waste Classification" },
    { badgeId: "programmer", earnedAt: "2026-03-20" },
    { badgeId: "innovation", earnedAt: "2026-06-05" },
  ],
  s_kiara: [
    { badgeId: "leadership", earnedAt: "2025-09-01", note: "Project leader, Solar Tracking System" },
    { badgeId: "engineering", earnedAt: "2026-06-13", note: "National Electronics Design Contest" },
    { badgeId: "peer_coach", earnedAt: "2026-05-18", note: "Arduino Bootcamp instructor" },
  ],
  s_dhruv: [
    { badgeId: "leadership", earnedAt: "2025-09-01", note: "Project leader, Bridge Engineering Challenge" },
    { badgeId: "engineering", earnedAt: "2026-05-30" },
  ],
  s_meera: [
    { badgeId: "leadership", earnedAt: "2025-09-01", note: "Project leader, Research Paper Repository" },
    { badgeId: "science_fair", earnedAt: "2026-04-25", note: "National Science Project Olympiad — 1st place" },
  ],
  s_ethan: [{ badgeId: "programmer", earnedAt: "2026-02-28", note: "Attendance Portal check-in service" }],
  s_kevin: [{ badgeId: "leadership", earnedAt: "2026-04-20", note: "Project leader, Drone Mapping" }],
  s_priyanka: [{ badgeId: "leadership", earnedAt: "2026-02-16", note: "Project leader, Pepper's Ghost Hologram" }],
  s_hana: [{ badgeId: "leadership", earnedAt: "2026-04-06", note: "Project leader, Smart Irrigation" }],
  s_yusuf: [{ badgeId: "leadership", earnedAt: "2026-02-02", note: "Project leader, IoT Weather Station" }],
  s_bastian: [
    { badgeId: "leadership", earnedAt: "2026-03-23", note: "Project leader, Air Quality Data Study" },
    { badgeId: "science_fair", earnedAt: "2026-04-25" },
  ],
  s_sanya: [{ badgeId: "programmer", earnedAt: "2026-04-10" }],
  s_clara: [{ badgeId: "innovation", earnedAt: "2026-03-14" }],
  s_ishaan: [{ badgeId: "peer_coach", earnedAt: "2026-06-12" }],
  s_aditi: [{ badgeId: "engineering", earnedAt: "2026-06-13" }],
  s_sekar: [{ badgeId: "innovation", earnedAt: "2026-05-22" }],
  s_yerin: [{ badgeId: "science_fair", earnedAt: "2026-06-20" }],
};

// --- Student profile --------------------------------------------------------

export type Skill = { name: string; level: number; category: string };

export const mockSkills: Record<string, Skill[]> = {
  u_student: [
    { name: "Arduino / Embedded C", level: 4, category: "Programming" },
    { name: "Python", level: 4, category: "Programming" },
    { name: "CAD (Fusion 360)", level: 3, category: "Design" },
    { name: "Soldering", level: 4, category: "Hardware" },
    { name: "Sensor Calibration", level: 4, category: "Hardware" },
    { name: "Data Logging & Analysis", level: 3, category: "Research" },
    { name: "Public Speaking", level: 3, category: "Communication" },
  ],
};

export type Certificate = { id: string; title: string; issuer: string; date: string };

export const mockCertificates: Record<string, Certificate[]> = {
  u_student: [
    { id: "cert1", title: "Arduino Fundamentals", issuer: "GMIS STEM Club", date: "2026-02-13" },
    { id: "cert2", title: "Introduction to Robotics", issuer: "Coursera", date: "2025-11-21" },
    { id: "cert3", title: "Lab Safety & Soldering Certification", issuer: "GMIS Science Department", date: "2025-09-05" },
  ],
};

export type StudentProfile = {
  studentId: string;
  headline: string;
  about: string;
  location: string;
  email: string;
};

export const mockProfiles: Record<string, StudentProfile> = {
  u_student: {
    studentId: "u_student",
    headline: "Grade 11 · GMIS STEM Club",
    about:
      "I build competition robots with the GMIS STEM Club and own the sensor array on our Autonomous Robot project. Most of my time goes into embedded C, sensor calibration, and working out why the control loop overshoots on tight corners. I want to study mechatronics engineering, and on Wednesdays I coach the Grade 8 Arduino starter sessions.",
    location: "Jakarta Timur, Indonesia",
    email: "anaya.kapoor@student.gmis.sch.id",
  },
};

// --- Notifications ----------------------------------------------------------
// Only events the app can actually produce today: tasks, announcements,
// events, competition deadlines, and resource uploads.

export type NotificationType =
  | "task_assigned"
  | "task_completed"
  | "announcement"
  | "event_reminder"
  | "competition_deadline"
  | "resource_uploaded";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const mockNotifications: Notification[] = [
  { id: "n1", type: "task_assigned", title: "Task assigned", body: "Tune the control loop on the practice track — Autonomous Robot", time: "18m ago", unread: true },
  { id: "n2", type: "announcement", title: "Announcement posted", body: "Workshop registration opens: Sensors & Motor Drivers", time: "2h ago", unread: true },
  { id: "n3", type: "task_completed", title: "Task completed", body: "Kevin Tanuwijaya finished “Mount the camera gimbal” — Drone Mapping", time: "5h ago", unread: true },
  { id: "n4", type: "event_reminder", title: "Event reminder", body: "Weekly STEM Club Meeting — Wednesday 15:30, Science Block Lab 2", time: "1d ago", unread: false },
  { id: "n5", type: "competition_deadline", title: "Competition deadline", body: "Inter-school STEM Competition roster closes 20 August", time: "2d ago", unread: false },
  { id: "n6", type: "resource_uploaded", title: "Resource uploaded", body: "Autonomous Robot Wiring Diagram.png added to the library", time: "5d ago", unread: false },
];

// --- Recent activity --------------------------------------------------------
// Derived from the fixtures above rather than invented, so the club feed can
// never contradict the pages it summarises.

export type ActivityItem = {
  id: string;
  kind: "announcement" | "resource" | "competition" | "event";
  text: string;
  actor: string;
  date: string;
};

export const mockActivity: ActivityItem[] = [
  ...mockAnnouncements.map((a) => ({
    id: `act_${a.id}`,
    kind: "announcement" as const,
    text: `Posted “${a.title}”`,
    actor: a.author,
    date: a.date,
  })),
  ...mockResources.map((r) => ({
    id: `act_${r.id}`,
    kind: "resource" as const,
    text: `Uploaded ${r.title}`,
    actor: r.uploadedBy,
    date: r.date,
  })),
  ...mockCompetitions
    .filter((c) => c.status === "completed")
    .map((c) => ({
      id: `act_${c.id}`,
      kind: "competition" as const,
      text: `${c.name} — ${c.result}`,
      actor: mockSchool.clubName,
      date: c.date,
    })),
].sort((a, b) => (a.date < b.date ? 1 : -1));

// --- Club-wide counts -------------------------------------------------------
// Every headline number in the app reads from here, so nothing can drift out
// of step with the data it claims to describe.

export const clubStats = {
  students: mockStudents.length,
  activeStudents: mockStudents.filter((s) => s.status === "active").length,
  pendingApplications: mockStudents.filter((s) => s.status === "invited").length,
  projects: mockProjects.length,
  activeProjects: mockProjects.filter((p) => p.status === "active").length,
  completedProjects: mockProjects.filter((p) => p.status === "completed").length,
  competitions: mockCompetitions.length,
  upcomingCompetitions: mockCompetitions.filter((c) => c.status === "upcoming").length,
  resources: mockResources.length,
  announcements: mockAnnouncements.length,
  upcomingEvents: mockEvents.filter((e) => e.date >= DEMO_TODAY).length,
};

// Mock data for the global, cross-school STEM ecosystem layer (Phase 5):
// discover, directories, showcases, and community features. Kept in its own
// module from mock-data.ts (which is tenant/session-scoped) since this data
// is public and spans many schools/countries rather than one tenant.

export type GlobalSchool = {
  id: string;
  slug: string;
  name: string;
  country: string;
  city: string;
  curriculum: string;
  categories: string[];
  founded: number;
  description: string;
  cover: string;
  stats: { students: number; clubs: number; projects: number; competitionsWon: number };
  achievements: string[];
  galleryCount: number;
  featuredProjectIds: string[];
  featuredStudentIds: string[];
};

const COVERS = [
  "from-primary to-brand-spark",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-purple-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-500",
  "from-rose-500 to-pink-500",
  "from-violet-500 to-indigo-500",
  "from-lime-500 to-emerald-500",
];

export const mockGlobalSchools: GlobalSchool[] = [
  {
    id: "gs1", slug: "sman8-jakarta", name: "SMA Negeri 8 Jakarta", country: "Indonesia", city: "Jakarta",
    curriculum: "National", categories: ["Robotics", "Computer Science", "Biology", "Mathematics"], founded: 1957,
    description: "One of Jakarta's top public schools, home to the region's most decorated robotics team.",
    cover: COVERS[0], stats: { students: 727, clubs: 17, projects: 42, competitionsWon: 8 },
    achievements: ["1st Place — FBRI Regional Robotics Qualifier 2026", "3rd Place — Indonesia Science Fair 2026"],
    galleryCount: 8, featuredProjectIds: ["proj_line_bot_pub", "proj_water_pub"], featuredStudentIds: ["gstu1", "gstu2"],
  },
  {
    id: "gs2", slug: "sma-kristen-ipeka", name: "SMA Kristen IPEKA", country: "Indonesia", city: "Jakarta",
    curriculum: "Cambridge IGCSE", categories: ["Computer Science", "Engineering"], founded: 1996,
    description: "A Cambridge-curriculum school known for its applied engineering and coding programs.",
    cover: COVERS[1], stats: { students: 640, clubs: 12, projects: 31, competitionsWon: 5 },
    achievements: ["Finalist — ASEAN Coding Challenge 2025"],
    galleryCount: 6, featuredProjectIds: ["proj_app_pub"], featuredStudentIds: ["gstu3"],
  },
  {
    id: "gs3", slug: "sekolah-cikal", name: "Sekolah Cikal Amri Setu", country: "Indonesia", city: "Jakarta",
    curriculum: "IB", categories: ["Environmental Science", "Design"], founded: 2007,
    description: "An IB World School with a strong sustainability and design-thinking focus.",
    cover: COVERS[2], stats: { students: 480, clubs: 9, projects: 22, competitionsWon: 3 },
    achievements: ["Regional finalist — Indonesia Science Fair 2026"],
    galleryCount: 5, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs4", slug: "binus-school-serpong", name: "Binus School Serpong", country: "Indonesia", city: "Tangerang",
    curriculum: "National Plus", categories: ["Computer Science", "Robotics"], founded: 2007,
    description: "A national-plus school with one of Indonesia's largest competitive programming clubs.",
    cover: COVERS[3], stats: { students: 910, clubs: 15, projects: 38, competitionsWon: 6 },
    achievements: ["Champion — Hackathon Jakarta 2026"],
    galleryCount: 7, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs5", slug: "sma-taruna-bandung", name: "SMA Taruna Bakti", country: "Indonesia", city: "Bandung",
    curriculum: "National", categories: ["Physics", "Robotics"], founded: 1970,
    description: "A Bandung institution recognized for its physics olympiad and aerospace clubs.",
    cover: COVERS[4], stats: { students: 560, clubs: 10, projects: 19, competitionsWon: 4 },
    achievements: ["Gold Medal — National Physics Olympiad 2025"],
    galleryCount: 4, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs6", slug: "smak-petra-surabaya", name: "SMAK Petra 2 Surabaya", country: "Indonesia", city: "Surabaya",
    curriculum: "National Plus", categories: ["Biology", "Chemistry"], founded: 1980,
    description: "Surabaya's leading science-track school with an active marine biology research group.",
    cover: COVERS[5], stats: { students: 700, clubs: 11, projects: 24, competitionsWon: 3 },
    achievements: ["Best Poster — Indonesia Science Fair 2025"],
    galleryCount: 5, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs7", slug: "sma-taman-siswa-yogyakarta", name: "SMA Taman Siswa", country: "Indonesia", city: "Yogyakarta",
    curriculum: "National", categories: ["Cultural Tech", "Robotics"], founded: 1922,
    description: "A historic Yogyakarta school blending traditional craft with modern fabrication.",
    cover: COVERS[6], stats: { students: 410, clubs: 8, projects: 14, competitionsWon: 2 },
    achievements: ["Regional finalist — Robotics Scrimmage 2026"],
    galleryCount: 4, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs8", slug: "green-school-bali", name: "Green School Bali", country: "Indonesia", city: "Badung",
    curriculum: "IB", categories: ["Environmental Science", "Sustainable Engineering"], founded: 2008,
    description: "A campus-as-curriculum school where students build renewable-energy systems for their own campus.",
    cover: COVERS[7], stats: { students: 380, clubs: 7, projects: 20, competitionsWon: 2 },
    achievements: ["Global Finalist — Sustainability Design Challenge 2025"],
    galleryCount: 6, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs9", slug: "sma-methodist-medan", name: "SMA Methodist 2 Medan", country: "Indonesia", city: "Medan",
    curriculum: "National", categories: ["Computer Science"], founded: 1952,
    description: "Medan's top scorer at the national informatics olympiad three years running.",
    cover: COVERS[0], stats: { students: 520, clubs: 9, projects: 17, competitionsWon: 3 },
    achievements: ["1st Place — National Informatics Olympiad (Sumatra Region) 2026"],
    galleryCount: 4, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs10", slug: "sma-labschool-makassar", name: "SMA Labschool Makassar", country: "Indonesia", city: "Makassar",
    curriculum: "National", categories: ["Marine Science", "Robotics"], founded: 1994,
    description: "Eastern Indonesia's rising STEM program, focused on marine robotics.",
    cover: COVERS[1], stats: { students: 340, clubs: 6, projects: 12, competitionsWon: 1 },
    achievements: ["New program — first competition entry 2026"],
    galleryCount: 3, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs11", slug: "raffles-institution-sg", name: "Raffles Institution", country: "Singapore", city: "Singapore",
    curriculum: "GCE A-Level", categories: ["Computer Science", "Robotics", "Biotechnology"], founded: 1823,
    description: "One of Southeast Asia's most decorated STEM programs, with alumni across major research universities.",
    cover: COVERS[2], stats: { students: 1_800, clubs: 24, projects: 65, competitionsWon: 21 },
    achievements: ["Gold — International Biology Olympiad 2026", "Champion — ASEAN Coding Challenge 2026"],
    galleryCount: 10, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs12", slug: "smk-tunas-kl", name: "Tunas STEM Academy", country: "Malaysia", city: "Kuala Lumpur",
    curriculum: "Cambridge IGCSE", categories: ["Robotics", "Renewable Energy"], founded: 2003,
    description: "A Kuala Lumpur STEM academy known for its solar-vehicle racing team.",
    cover: COVERS[3], stats: { students: 620, clubs: 11, projects: 27, competitionsWon: 5 },
    achievements: ["Champion — ASEAN Solar Challenge 2025"],
    galleryCount: 5, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs13", slug: "dpsi-mumbai", name: "Delhi Public School International", country: "India", city: "Mumbai",
    curriculum: "IB", categories: ["Computer Science", "AI Ethics", "Robotics"], founded: 1998,
    description: "A Mumbai IB school with one of India's most active student research journals.",
    cover: COVERS[4], stats: { students: 1_200, clubs: 18, projects: 54, competitionsWon: 14 },
    achievements: ["Best Paper — International Student Research Symposium 2026"],
    galleryCount: 8, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs14", slug: "north-london-stem", name: "North London STEM Academy", country: "United Kingdom", city: "London",
    curriculum: "A-Level", categories: ["Engineering", "Computer Science"], founded: 1965,
    description: "A London academy with a dedicated FabLab and a long-running Formula Student Micro team.",
    cover: COVERS[5], stats: { students: 890, clubs: 13, projects: 33, competitionsWon: 9 },
    achievements: ["Champion — UK Schools Formula Student Micro 2026"],
    galleryCount: 6, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs15", slug: "bay-area-innovation-high", name: "Bay Area Innovation High", country: "United States", city: "San Francisco",
    curriculum: "American", categories: ["Computer Science", "Robotics", "Biotech"], founded: 2011,
    description: "A project-based San Francisco school with close ties to nearby university labs.",
    cover: COVERS[6], stats: { students: 540, clubs: 16, projects: 47, competitionsWon: 11 },
    achievements: ["Grand Award — International Science and Engineering Fair 2026"],
    galleryCount: 9, featuredProjectIds: [], featuredStudentIds: [],
  },
  {
    id: "gs16", slug: "sydney-tech-grammar", name: "Sydney Technology Grammar", country: "Australia", city: "Sydney",
    curriculum: "HSC", categories: ["Marine Science", "Robotics"], founded: 1889,
    description: "A heritage Sydney school pairing marine science fieldwork with underwater robotics.",
    cover: COVERS[7], stats: { students: 760, clubs: 12, projects: 29, competitionsWon: 6 },
    achievements: ["1st Place — MATE ROV Asia-Pacific Regional 2026"],
    galleryCount: 5, featuredProjectIds: [], featuredStudentIds: [],
  },
];

export type GlobalStudent = {
  id: string;
  handle: string;
  name: string;
  school: string;
  country: string;
  headline: string;
  skills: string[];
  interests: string[];
  avatarInitials: string;
  followers: number;
};

export const mockGlobalStudents: GlobalStudent[] = [
  { id: "gstu0", handle: "sofia-kim", name: "Sofia Kim", school: "SMA Negeri 8 Jakarta", country: "Indonesia", headline: "Build Team Captain @ Robotics Club · Regional Qualifier Champion", skills: ["Python", "Embedded C", "CAD"], interests: ["Robotics", "Mechatronics"], avatarInitials: "SK", followers: 214 },
  { id: "gstu1", handle: "aditya-pratama", name: "Aditya Pratama", school: "SMA Negeri 8 Jakarta", country: "Indonesia", headline: "Robotics Club Leader · Regional Champion", skills: ["Embedded C", "ROS", "Leadership"], interests: ["Robotics", "Competitive Programming"], avatarInitials: "AP", followers: 301 },
  { id: "gstu2", handle: "hana-pratama", name: "Hana Pratama", school: "SMA Negeri 8 Jakarta", country: "Indonesia", headline: "3D printing & rapid prototyping", skills: ["CAD", "3D Printing", "Python"], interests: ["Manufacturing", "Robotics"], avatarInitials: "HP", followers: 88 },
  { id: "gstu3", handle: "bagus-anggraini", name: "Bagus Anggraini", school: "SMA Kristen IPEKA", country: "Indonesia", headline: "Full-stack student developer", skills: ["React Native", "TypeScript", "Node.js"], interests: ["Mobile Apps", "Startups"], avatarInitials: "BA", followers: 176 },
  { id: "gstu4", handle: "citra-halim", name: "Citra Halim", school: "SMA Negeri 8 Jakarta", country: "Indonesia", headline: "Water quality researcher", skills: ["Data Analysis", "Chemistry", "R"], interests: ["Environmental Science"], avatarInitials: "CH", followers: 132 },
  { id: "gstu5", handle: "galih-kurniawan", name: "Galih Kurniawan", school: "SMA Negeri 8 Jakarta", country: "Indonesia", headline: "Math Olympiad — national finalist", skills: ["Combinatorics", "Number Theory"], interests: ["Mathematics", "Competitive Programming"], avatarInitials: "GK", followers: 95 },
  { id: "gstu6", handle: "kenji-tanaka", name: "Kenji Tanaka", school: "Raffles Institution", country: "Singapore", headline: "Biotech researcher, IBO gold medalist", skills: ["Molecular Biology", "Python", "Lab Research"], interests: ["Biotechnology", "Genomics"], avatarInitials: "KT", followers: 410 },
  { id: "gstu7", handle: "mei-lin", name: "Mei Lin", school: "Raffles Institution", country: "Singapore", headline: "Competitive programmer & robotics lead", skills: ["C++", "Algorithms", "ROS"], interests: ["Robotics", "AI"], avatarInitials: "ML", followers: 388 },
  { id: "gstu8", handle: "arjun-mehta", name: "Arjun Mehta", school: "Delhi Public School International", country: "India", headline: "Student researcher — AI ethics", skills: ["Python", "Research Writing", "Statistics"], interests: ["AI Ethics", "Policy"], avatarInitials: "AM", followers: 267 },
  { id: "gstu9", handle: "olivia-bennett", name: "Olivia Bennett", school: "North London STEM Academy", country: "United Kingdom", headline: "Formula Student Micro chassis lead", skills: ["CAD", "Composites", "Project Management"], interests: ["Automotive Engineering"], avatarInitials: "OB", followers: 198 },
  { id: "gstu10", handle: "ethan-cole", name: "Ethan Cole", school: "Bay Area Innovation High", country: "United States", headline: "ISEF Grand Award winner — bioinformatics", skills: ["Python", "Bioinformatics", "Machine Learning"], interests: ["Biotech", "AI"], avatarInitials: "EC", followers: 512 },
  { id: "gstu11", handle: "chloe-nguyen", name: "Chloe Nguyen", school: "Sydney Technology Grammar", country: "Australia", headline: "Underwater ROV pilot & builder", skills: ["Electronics", "Swift", "Marine Biology"], interests: ["Marine Robotics"], avatarInitials: "CN", followers: 221 },
  { id: "gstu12", handle: "dimas-wibowo", name: "Dimas Wibowo", school: "Binus School Serpong", country: "Indonesia", headline: "Competitive programming captain", skills: ["C++", "Algorithms"], interests: ["Competitive Programming"], avatarInitials: "DW", followers: 143 },
  { id: "gstu13", handle: "aisha-rahman", name: "Aisha Rahman", school: "Tunas STEM Academy", country: "Malaysia", headline: "Solar vehicle team electrical lead", skills: ["Circuit Design", "MATLAB"], interests: ["Renewable Energy"], avatarInitials: "AR", followers: 167 },
  { id: "gstu14", handle: "putri-wibowo", name: "Putri Wibowo", school: "SMA Negeri 8 Jakarta", country: "Indonesia", headline: "Sensor systems & firmware", skills: ["Embedded C", "Soldering"], interests: ["Robotics"], avatarInitials: "PW", followers: 76 },
];

export type ShowcaseComment = { id: string; author: string; body: string; time: string };

export type ShowcaseProject = {
  id: string;
  title: string;
  school: string;
  country: string;
  category: string;
  technologies: string[];
  contributors: string[];
  description: string;
  longDescription: string;
  cover: string;
  progress: number;
  status: "active" | "completed";
  likes: number;
  bookmarks: number;
  downloads: number;
  galleryCount: number;
  comments: ShowcaseComment[];
};

export const mockShowcaseProjects: ShowcaseProject[] = [
  {
    id: "proj_line_bot_pub", title: "Line-Following Robot v3", school: "SMA Negeri 8 Jakarta", country: "Indonesia",
    category: "Robotics", technologies: ["Arduino", "Embedded C", "PID Control"], contributors: ["Sofia Kim", "Aditya Pratama", "Hana Pratama"],
    description: "Sensor-guided competition bot built for the FBRI regional qualifier.",
    longDescription: "A four-sensor line-following robot with a tuned PID control loop, custom 3D-printed chassis, and swappable sensor mounts. Took 1st place at the FBRI Regional Robotics Qualifier 2026.",
    cover: COVERS[0], progress: 82, status: "active", likes: 341, bookmarks: 58, downloads: 120, galleryCount: 6,
    comments: [
      { id: "pc1", author: "Kenji Tanaka", body: "The sensor mount redesign is really clean — any plans to open source the STL files?", time: "2d ago" },
      { id: "pc2", author: "Aditya Pratama", body: "Yes! Uploading to the resource library after nationals.", time: "1d ago" },
    ],
  },
  {
    id: "proj_water_pub", title: "Water Quality Sensor Array", school: "SMA Negeri 8 Jakarta", country: "Indonesia",
    category: "Environmental Science", technologies: ["Raspberry Pi", "Python", "IoT Sensors"], contributors: ["Citra Halim", "Joko Nugroho"],
    description: "Low-cost sensor rig for testing river water near the school.",
    longDescription: "A solar-powered sensor buoy measuring pH, turbidity, and dissolved oxygen along the Ciliwung River, logging readings to a public dashboard for community monitoring.",
    cover: COVERS[4], progress: 65, status: "active", likes: 198, bookmarks: 44, downloads: 67, galleryCount: 5,
    comments: [
      { id: "pc3", author: "Ethan Cole", body: "Love that this feeds a public dashboard — how are you handling calibration drift?", time: "3d ago" },
    ],
  },
  {
    id: "proj_app_pub", title: "STEMORA Companion App", school: "SMA Kristen IPEKA", country: "Indonesia",
    category: "Software", technologies: ["React Native", "TypeScript", "Supabase"], contributors: ["Bagus Anggraini", "Indra Saputra"],
    description: "A mobile companion app for club meeting schedules.",
    longDescription: "A lightweight React Native app that syncs club schedules, assignment due dates, and announcements — built as a Code Collective side project and shared with three other clubs.",
    cover: COVERS[1], progress: 54, status: "active", likes: 156, bookmarks: 39, downloads: 210, galleryCount: 4,
    comments: [],
  },
  {
    id: "proj_solar_car", title: "Solar Racer MK4", school: "Tunas STEM Academy", country: "Malaysia",
    category: "Renewable Energy", technologies: ["Solar Cells", "MATLAB", "Composite Materials"], contributors: ["Aisha Rahman"],
    description: "Championship solar vehicle for the ASEAN Solar Challenge.",
    longDescription: "A carbon-fiber-bodied solar racer with a custom MPPT charge controller, built over two years and crowned champion at the 2025 ASEAN Solar Challenge.",
    cover: COVERS[3], progress: 100, status: "completed", likes: 402, bookmarks: 71, downloads: 88, galleryCount: 9,
    comments: [
      { id: "pc4", author: "Olivia Bennett", body: "The MPPT efficiency numbers in your writeup are impressive — great work.", time: "1w ago" },
    ],
  },
  {
    id: "proj_genome", title: "Rapid Genome Variant Classifier", school: "Raffles Institution", country: "Singapore",
    category: "Biotechnology", technologies: ["Python", "scikit-learn", "Genomics"], contributors: ["Kenji Tanaka"],
    description: "ML pipeline that flags likely-pathogenic genome variants from public datasets.",
    longDescription: "A gradient-boosted classifier trained on public ClinVar data, built as an entry to the International Biology Olympiad research track, earning a gold medal.",
    cover: COVERS[2], progress: 100, status: "completed", likes: 512, bookmarks: 120, downloads: 340, galleryCount: 3,
    comments: [
      { id: "pc5", author: "Arjun Mehta", body: "Would love to see the feature importance breakdown — is the notebook public?", time: "4d ago" },
    ],
  },
  {
    id: "proj_rov", title: "Reef Survey ROV", school: "Sydney Technology Grammar", country: "Australia",
    category: "Marine Robotics", technologies: ["Underwater Electronics", "Swift", "Camera Vision"], contributors: ["Chloe Nguyen"],
    description: "Tethered ROV for shallow-reef survey work.",
    longDescription: "A 4-thruster underwater ROV with a live camera feed and depth-hold, used for citizen-science reef surveys along the New South Wales coast.",
    cover: COVERS[6], progress: 90, status: "active", likes: 267, bookmarks: 52, downloads: 74, galleryCount: 7,
    comments: [],
  },
  {
    id: "proj_ai_ethics", title: "AI Ethics in Schools — Survey Tool", school: "Delhi Public School International", country: "India",
    category: "AI Ethics", technologies: ["Python", "Survey Design", "Data Viz"], contributors: ["Arjun Mehta"],
    description: "A survey instrument measuring student attitudes toward AI use in classrooms.",
    longDescription: "A validated survey deployed across 6 schools in Mumbai, with results published as a student research paper and cited in a district policy review.",
    cover: COVERS[5], progress: 100, status: "completed", likes: 189, bookmarks: 61, downloads: 145, galleryCount: 2,
    comments: [],
  },
  {
    id: "proj_formula_micro", title: "Formula Student Micro Chassis", school: "North London STEM Academy", country: "United Kingdom",
    category: "Automotive Engineering", technologies: ["CAD", "Composites", "FEA"], contributors: ["Olivia Bennett"],
    description: "Championship-winning micro-formula chassis design.",
    longDescription: "A carbon-composite monocoque chassis optimized through iterative FEA simulation, driving the team to the 2026 UK Schools Formula Student Micro title.",
    cover: COVERS[7], progress: 100, status: "completed", likes: 233, bookmarks: 47, downloads: 55, galleryCount: 6,
    comments: [],
  },
];

export type ResearchType = "Paper" | "Poster" | "Case Study";

export type ResearchItem = {
  id: string;
  title: string;
  type: ResearchType;
  authors: string[];
  school: string;
  category: string;
  abstract: string;
  date: string;
  likes: number;
  comments: ShowcaseComment[];
};

export const mockResearchItems: ResearchItem[] = [
  { id: "res_g1", title: "Low-Cost Water Quality Monitoring for Urban Rivers", type: "Paper", authors: ["Citra Halim", "Joko Nugroho"], school: "SMA Negeri 8 Jakarta", category: "Environmental Science", abstract: "We present a solar-powered sensor buoy design costing under $80 that measures pH, turbidity, and dissolved oxygen, validated against laboratory instruments over an 8-week deployment on the Ciliwung River.", date: "2026-04-01", likes: 88, comments: [] },
  { id: "res_g2", title: "Rapid Classification of Pathogenic Genome Variants Using Gradient Boosting", type: "Paper", authors: ["Kenji Tanaka"], school: "Raffles Institution", category: "Biotechnology", abstract: "A gradient-boosted classifier trained on public ClinVar variant data achieves 91% accuracy in flagging likely-pathogenic variants, offering a lightweight triage tool for student and clinical researchers alike.", date: "2026-05-18", likes: 214, comments: [] },
  { id: "res_g3", title: "Student Attitudes Toward AI Use in the Classroom: A 6-School Survey", type: "Case Study", authors: ["Arjun Mehta"], school: "Delhi Public School International", category: "AI Ethics", abstract: "A validated survey of 1,240 students across six Mumbai schools finds strong support for AI-assisted study tools but significant concern over assessment integrity, informing a district-level policy review.", date: "2026-03-22", likes: 156, comments: [] },
  { id: "res_g4", title: "MPPT Efficiency Gains in a Championship Solar Racer", type: "Poster", authors: ["Aisha Rahman"], school: "Tunas STEM Academy", category: "Renewable Energy", abstract: "A custom maximum-power-point-tracking controller improved panel efficiency by 14% over an off-the-shelf unit, contributing to a championship finish at the 2025 ASEAN Solar Challenge.", date: "2025-11-02", likes: 97, comments: [] },
  { id: "res_g5", title: "PID Tuning Strategies for Low-Cost Line-Following Robots", type: "Poster", authors: ["Sofia Kim", "Aditya Pratama"], school: "SMA Negeri 8 Jakarta", category: "Robotics", abstract: "We compare three PID auto-tuning strategies on a budget line-following platform, finding Ziegler-Nichols with manual refinement outperforms both fixed-gain and pure auto-tune approaches on our test track.", date: "2026-06-01", likes: 132, comments: [] },
  { id: "res_g6", title: "Shallow-Reef Survey Coverage Using Low-Cost Tethered ROVs", type: "Case Study", authors: ["Chloe Nguyen"], school: "Sydney Technology Grammar", category: "Marine Science", abstract: "A student-built ROV completed 40 survey dives across 6 reef sites, demonstrating that sub-$1,000 platforms can meaningfully contribute to citizen-science coral monitoring programs.", date: "2026-02-14", likes: 121, comments: [] },
  { id: "res_g7", title: "Composite Monocoque Design for Micro-Formula Chassis", type: "Paper", authors: ["Olivia Bennett"], school: "North London STEM Academy", category: "Automotive Engineering", abstract: "Iterative FEA-guided design of a carbon-composite monocoque reduced chassis weight by 22% versus the prior tubular-steel frame while maintaining torsional stiffness targets.", date: "2026-01-30", likes: 74, comments: [] },
  { id: "res_g8", title: "Bioinformatics Pipeline for Rapid Pathogen Screening", type: "Paper", authors: ["Ethan Cole"], school: "Bay Area Innovation High", category: "Biotechnology", abstract: "An open-source bioinformatics pipeline reduces pathogen screening turnaround from days to hours on consumer hardware, earning a Grand Award at ISEF 2026.", date: "2026-05-05", likes: 267, comments: [] },
];

export type CompetitionRegistration = "open" | "closed" | "upcoming";

export type GlobalCompetition = {
  id: string;
  name: string;
  organizer: string;
  category: string;
  level: string;
  country: string;
  date: string;
  registration: CompetitionRegistration;
  participants: number;
  description: string;
};

export const mockGlobalCompetitions: GlobalCompetition[] = [
  { id: "gc1", name: "National Robotics Championship", organizer: "FBRI", category: "Robotics", level: "National", country: "Indonesia", date: "2026-08-08", registration: "closed", participants: 640, description: "Indonesia's largest school robotics championship, culminating a season of regional qualifiers." },
  { id: "gc2", name: "ASEAN Coding Challenge", organizer: "ASEAN STEM Council", category: "Computer Science", level: "International", country: "Singapore", date: "2026-09-12", registration: "open", participants: 1_200, description: "A regional competitive-programming contest for secondary school students across ASEAN member states." },
  { id: "gc3", name: "International Science and Engineering Fair", organizer: "Society for Science", category: "Multi-disciplinary", level: "International", country: "United States", date: "2026-05-10", registration: "closed", participants: 1_800, description: "The world's largest pre-college science competition, spanning every STEM discipline." },
  { id: "gc4", name: "MATE ROV Asia-Pacific Regional", organizer: "MATE ROV Competition", category: "Marine Robotics", level: "Regional", country: "Australia", date: "2026-07-20", registration: "closed", participants: 210, description: "An underwater-robotics competition simulating real ocean-engineering missions." },
  { id: "gc5", name: "ASEAN Solar Challenge", organizer: "ASEAN STEM Council", category: "Renewable Energy", level: "International", country: "Malaysia", date: "2026-11-15", registration: "upcoming", participants: 0, description: "A student solar-vehicle endurance race across Southeast Asia." },
  { id: "gc6", name: "International Biology Olympiad", organizer: "IBO", category: "Biology", level: "International", country: "Singapore", date: "2026-07-14", registration: "closed", participants: 320, description: "The premier global biology olympiad for pre-university students." },
  { id: "gc7", name: "UK Schools Formula Student Micro", organizer: "IMechE", category: "Automotive Engineering", level: "National", country: "United Kingdom", date: "2026-06-20", registration: "closed", participants: 180, description: "A scaled-down Formula Student competition for UK secondary schools." },
  { id: "gc8", name: "Indonesia Science Fair", organizer: "Kemendikbud", category: "Multi-disciplinary", level: "National", country: "Indonesia", date: "2026-10-05", registration: "upcoming", participants: 0, description: "Indonesia's national science fair spanning all STEM disciplines, feeding into ISEF selection." },
  { id: "gc9", name: "Global Youth AI Ethics Case Competition", organizer: "World STEM Forum", category: "AI Ethics", level: "International", country: "India", date: "2026-09-28", registration: "open", participants: 90, description: "Student teams present policy case studies on responsible AI use in education." },
  { id: "gc10", name: "Hackathon Jakarta", organizer: "Code Collective Network", category: "Software", level: "School", country: "Indonesia", date: "2026-07-19", registration: "closed", participants: 140, description: "A 24-hour student hackathon hosted across partner schools in Jakarta." },
];

export type GlobalEventType = "Workshop" | "Hackathon" | "Conference" | "Seminar";

export type GlobalEvent = {
  id: string;
  title: string;
  type: GlobalEventType;
  date: string;
  location: string;
  organizer: string;
  description: string;
  registrationOpen: boolean;
};

export const mockGlobalEvents: GlobalEvent[] = [
  { id: "ge1", title: "Intro to ROS2 for Competition Robots", type: "Workshop", date: "2026-08-15", location: "Online", organizer: "STEMORA Community", description: "A hands-on workshop covering ROS2 basics for teams building competition robots.", registrationOpen: true },
  { id: "ge2", title: "Jakarta Student Hackathon", type: "Hackathon", date: "2026-09-05", location: "Jakarta, Indonesia", organizer: "Code Collective Network", description: "A 24-hour build weekend for student teams across Jakarta STEM clubs.", registrationOpen: true },
  { id: "ge3", title: "World STEM Forum Annual Conference", type: "Conference", date: "2026-11-10", location: "Singapore", organizer: "World STEM Forum", description: "A three-day gathering of student researchers and school STEM programs from across the network.", registrationOpen: true },
  { id: "ge4", title: "Research Writing for Student Scientists", type: "Seminar", date: "2026-08-22", location: "Online", organizer: "STEMORA Research Hub", description: "A seminar on structuring and submitting a first student research paper.", registrationOpen: true },
  { id: "ge5", title: "Solar Vehicle Design Bootcamp", type: "Workshop", date: "2026-10-01", location: "Kuala Lumpur, Malaysia", organizer: "ASEAN STEM Council", description: "A two-day bootcamp on MPPT design and composite bodywork ahead of the ASEAN Solar Challenge.", registrationOpen: true },
  { id: "ge6", title: "Marine Robotics Field Day", type: "Workshop", date: "2026-09-19", location: "Sydney, Australia", organizer: "Sydney Technology Grammar", description: "A field day pairing student ROV pilots with marine biology researchers for reef survey practice.", registrationOpen: false },
  { id: "ge7", title: "Bay Area Student Research Symposium", type: "Conference", date: "2026-05-01", location: "San Francisco, USA", organizer: "Bay Area Innovation High", description: "An annual symposium where student researchers present alongside university faculty.", registrationOpen: false },
  { id: "ge8", title: "AI Ethics in Education — Panel", type: "Seminar", date: "2026-09-30", location: "Online", organizer: "World STEM Forum", description: "A panel discussion on responsible AI adoption in secondary STEM education.", registrationOpen: true },
];

export type ForumCategory = { id: string; name: string; description: string };

export type ForumPost = { id: string; author: string; body: string; time: string };

export type ForumThread = {
  id: string;
  categoryId: string;
  title: string;
  author: string;
  createdAt: string;
  body: string;
  posts: ForumPost[];
};

export const mockForumCategories: ForumCategory[] = [
  { id: "cat_robotics", name: "Robotics", description: "Build logs, sensor tuning, and competition strategy." },
  { id: "cat_code", name: "Software & AI", description: "Programming, apps, and machine learning projects." },
  { id: "cat_science", name: "Science & Research", description: "Research methods, papers, and lab techniques." },
  { id: "cat_college", name: "Life After School", description: "Admissions, summer programs, and STEM careers." },
  { id: "cat_general", name: "General STEM", description: "Everything else — club life, events, and general advice." },
];

export const mockForumThreads: ForumThread[] = [
  {
    id: "th1", categoryId: "cat_robotics", title: "Best budget IMU for line-following robots?", author: "Sofia Kim", createdAt: "2026-07-28",
    body: "We're getting drift on our current IMU during fast turns. What's worked well for other budget builds under $30?",
    posts: [
      { id: "p1", author: "Mei Lin", body: "MPU-6050 with a complementary filter has worked well for us — cheap and good enough for line-following speeds.", time: "2026-07-28" },
      { id: "p2", author: "Aditya Pratama", body: "Seconding the MPU-6050. Make sure to calibrate at rest before every match.", time: "2026-07-29" },
    ],
  },
  {
    id: "th2", categoryId: "cat_code", title: "Anyone using Supabase for a club project?", author: "Bagus Anggraini", createdAt: "2026-07-20",
    body: "Curious if anyone's shipped a student project on Supabase — how's the free tier held up for a club-sized app?",
    posts: [
      { id: "p3", author: "Ethan Cole", body: "Used it for a research data dashboard, free tier was plenty for our scale (a few hundred users).", time: "2026-07-21" },
    ],
  },
  {
    id: "th3", categoryId: "cat_science", title: "Tips for writing your first research abstract?", author: "Arjun Mehta", createdAt: "2026-06-15",
    body: "Submitting to a student journal for the first time — any structural tips for the abstract specifically?",
    posts: [
      { id: "p4", author: "Kenji Tanaka", body: "Lead with the result, not the method. Reviewers skim abstracts, so put your strongest finding in sentence one.", time: "2026-06-16" },
      { id: "p5", author: "Citra Halim", body: "Also keep it under 250 words — most journals will bounce it back otherwise.", time: "2026-06-16" },
    ],
  },
  {
    id: "th4", categoryId: "cat_college", title: "Do research competitions actually help with university admissions?", author: "Olivia Bennett", createdAt: "2026-05-30",
    body: "Weighing whether to spend the summer on a research project vs. more competition prep. Anyone have experience with how admissions teams weigh these?",
    posts: [
      { id: "p6", author: "Arjun Mehta", body: "From what our counselors said, a completed research project with a real writeup stands out more than another competition medal.", time: "2026-05-31" },
    ],
  },
  {
    id: "th5", categoryId: "cat_general", title: "How does your club handle onboarding new members?", author: "Chloe Nguyen", createdAt: "2026-05-10",
    body: "We get a wave of new members every term and struggle to ramp them up fast. What's worked for your club?",
    posts: [
      { id: "p7", author: "Aisha Rahman", body: "We pair every new member with a 'buddy' from the existing team for the first month — cut our ramp-up time in half.", time: "2026-05-11" },
    ],
  },
];

// --- Composed global feed ----------------------------------------------------

export type FeedItemType = "project" | "research" | "competition_result" | "forum" | "achievement";

export type FeedItem = {
  id: string;
  type: FeedItemType;
  actor: string;
  school?: string;
  schoolId?: string;
  title: string;
  body: string;
  time: string;
  likes: number;
  commentCount: number;
  bookmarks: number;
  href: string;
};

function schoolIdForName(name: string | undefined): string | undefined {
  return mockGlobalSchools.find((s) => s.name === name)?.id;
}

export function buildGlobalFeed(): FeedItem[] {
  const items: FeedItem[] = [];

  mockShowcaseProjects.slice(0, 5).forEach((p) => {
    items.push({
      id: `feed_proj_${p.id}`, type: "project", actor: p.contributors[0] ?? p.school, school: p.school, schoolId: schoolIdForName(p.school),
      title: `New project: ${p.title}`, body: p.description, time: "recently",
      likes: p.likes, commentCount: p.comments.length, bookmarks: p.bookmarks, href: `/projects/${p.id}`,
    });
  });

  mockResearchItems.slice(0, 4).forEach((r) => {
    items.push({
      id: `feed_res_${r.id}`, type: "research", actor: r.authors[0], school: r.school, schoolId: schoolIdForName(r.school),
      title: `Published ${r.type.toLowerCase()}: ${r.title}`, body: r.abstract, time: r.date,
      likes: r.likes, commentCount: r.comments.length, bookmarks: Math.round(r.likes / 4), href: `/research/${r.id}`,
    });
  });

  mockGlobalCompetitions
    .filter((c) => c.registration === "closed")
    .slice(0, 3)
    .forEach((c) => {
      items.push({
        id: `feed_comp_${c.id}`, type: "competition_result", actor: c.organizer,
        title: `${c.name} wrapped up`, body: c.description, time: c.date,
        likes: Math.round(c.participants / 4), commentCount: 0, bookmarks: 0, href: `/competitions/${c.id}`,
      });
    });

  mockForumThreads.slice(0, 3).forEach((t) => {
    items.push({
      id: `feed_forum_${t.id}`, type: "forum", actor: t.author,
      title: t.title, body: t.body, time: t.createdAt,
      likes: 0, commentCount: t.posts.length, bookmarks: 0, href: `/forums/${t.categoryId}/${t.id}`,
    });
  });

  return items.sort((a, b) => (a.time < b.time ? 1 : -1));
}

import type { Metadata } from "next";
import {
  Users,
  FolderKanban,
  Trophy,
  CalendarDays,
  Library,
  Megaphone,
  Award,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = { title: "Features — STEMORA" };

const FEATURES = [
  {
    icon: Users,
    tag: "STUDENTS",
    title: "Student roster",
    description:
      "One roster for the whole STEM Club. Invite students by school email, filter by grade, and see every project a student is on.",
  },
  {
    icon: FolderKanban,
    tag: "PROJECTS",
    title: "Projects & boards",
    description:
      "Each project has a category, a team, a project leader, a deadline, and a drag-and-drop board that tracks it from backlog to done.",
  },
  {
    icon: Trophy,
    tag: "COMPETITIONS",
    title: "Competition register",
    description:
      "Every competition the club enters — level, roster, date, and result — in one place instead of a spreadsheet.",
  },
  {
    icon: CalendarDays,
    tag: "EVENTS",
    title: "Events",
    description: "Meetings, workshops, showcases, and competition days on one schedule, with attendance built in.",
  },
  {
    icon: Library,
    tag: "RESOURCES",
    title: "Resource library",
    description: "Guides, rulebooks, and datasheets filed by category so a student can find them without asking.",
  },
  {
    icon: Megaphone,
    tag: "ANNOUNCEMENTS",
    title: "Announcements",
    description: "One message reaches every student in the club, with the important notices pinned to the top.",
  },
  {
    icon: Award,
    tag: "PROFILE",
    title: "Student profiles",
    description: "A real record for every student: skills, certificates, club awards, and the projects they actually shipped.",
  },
  {
    icon: ShieldCheck,
    tag: "ACCESS",
    title: "Three roles, no more",
    description: "Platform Owner, School Admin, Student. Each sees exactly what it should, and nothing more.",
  },
];

export default function FeaturesPage() {
  return (
    <Container className="py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">Features</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Everything it takes to run your STEM Club.
        </h1>
        <p className="mt-4 text-muted-foreground">
          No more piecing together a shared drive, a group chat, and three spreadsheets. Your school
          gets one workspace for its STEM Club — isolated from every other school and permissioned
          by role.
        </p>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.tag} className="bg-card p-7">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-4.5" strokeWidth={1.75} />
              </div>
              <span className="font-mono text-xs text-muted-foreground">{f.tag}</span>
            </div>
            <h2 className="mt-4 font-display font-semibold">{f.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

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
    tag: "MEMBERS",
    title: "Member management",
    description:
      "One roster for every club in your school. Invite students, assign club roles, and see who's active at a glance.",
  },
  {
    icon: FolderKanban,
    tag: "PROJECTS",
    title: "Projects & boards",
    description:
      "A home for every build, with a drag-and-drop board that tracks it from backlog to done.",
  },
  {
    icon: Trophy,
    tag: "COMPETITIONS",
    title: "Competition register",
    description:
      "Track every competition your clubs enter — level, roster, date, and result — in one place instead of a spreadsheet.",
  },
  {
    icon: CalendarDays,
    tag: "EVENTS",
    title: "Events",
    description: "Club meetings and school-wide events on one schedule, with RSVP counts built in.",
  },
  {
    icon: Library,
    tag: "RESOURCES",
    title: "Resource library",
    description: "Rulebooks, protocols, and starter kits stay with the club instead of in someone's inbox.",
  },
  {
    icon: Megaphone,
    tag: "ANNOUNCEMENTS",
    title: "Announcements",
    description: "Reach one club or the whole school, with the important notices pinned to the top.",
  },
  {
    icon: Award,
    tag: "PROFILE",
    title: "Student profiles",
    description: "A real record for every student: skills, badges, and the projects they actually shipped.",
  },
  {
    icon: ShieldCheck,
    tag: "ACCESS",
    title: "Role-based access",
    description: "Every role — student to school admin — sees exactly what it should, and nothing more.",
  },
];

export default function FeaturesPage() {
  return (
    <Container className="py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">Features</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Everything it takes to run your STEM clubs.
        </h1>
        <p className="mt-4 text-muted-foreground">
          No more piecing together a shared drive, a group chat, and three spreadsheets. STEMORA
          gives your school one workspace for every club — isolated per school and permissioned by
          role.
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

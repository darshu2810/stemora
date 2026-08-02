import Link from "next/link";
import {
  Users,
  FolderKanban,
  Trophy,
  CalendarDays,
  Library,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { NetworkHero } from "@/components/marketing/network-hero";

const PILLARS = [
  {
    icon: Users,
    tag: "MEMBERS",
    title: "Members",
    description: "One roster across every club — invite students, assign club roles, and see who's actually showing up.",
  },
  {
    icon: FolderKanban,
    tag: "PROJECTS",
    title: "Projects & boards",
    description: "Every build gets a home, with a drag-and-drop board for the robotics build, the science fair entry, the hackathon sprint.",
  },
  {
    icon: Trophy,
    tag: "COMPETITIONS",
    title: "Competitions",
    description: "Every entry, roster, and result in one register — not scattered across a term's worth of spreadsheets.",
  },
  {
    icon: CalendarDays,
    tag: "EVENTS",
    title: "Events",
    description: "Club meetings and school-wide events on one schedule, with RSVPs built in.",
  },
  {
    icon: Library,
    tag: "RESOURCES",
    title: "Resources",
    description: "Rulebooks, protocols, and starter kits that stay with the club instead of in someone's inbox.",
  },
  {
    icon: Megaphone,
    tag: "ANNOUNCEMENTS",
    title: "Announcements",
    description: "Reach one club or the whole school, with the notices that matter pinned to the top.",
  },
];

const ROLES = [
  { role: "School Admin", detail: "Full control of your school's workspace, members, and settings." },
  { role: "Student", detail: "One place for meetings, builds, deadlines, and the people doing it with you." },
];

export default function MarketingHomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-blueprint-grid absolute inset-0" aria-hidden />
        <Container className="relative grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              STEMORA / STEM CLUB MANAGEMENT
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              One workspace for all your school&apos;s STEM clubs.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Members, projects, competitions, events, resources, and announcements — built for how
              STEM clubs actually run, in a secure workspace that belongs to your school alone.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                render={
                  <Link href="/schools/new">
                    Start your school <ArrowRight className="size-4" />
                  </Link>
                }
              />
              <Button size="lg" variant="outline" render={<Link href="/features">See how it works</Link>} />
            </div>
            <p className="mt-12 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Free while we pilot · Set up in minutes · No card required
            </p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <NetworkHero />
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Six tools, one hub</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              Everything your clubs need, nothing you have to stitch together.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.tag}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <pillar.icon className="size-4.5" strokeWidth={1.75} />
                  </div>
                  <span className="font-mono text-[0.65rem] tracking-wider text-muted-foreground">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="mt-4 font-display font-semibold">{pillar.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-20">
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Built for every role</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              The right view for whoever&apos;s logged in.
            </h2>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {ROLES.map((r) => (
              <div key={r.role} className="bg-card p-6">
                <h3 className="font-display font-semibold">{r.role}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container className="flex flex-col items-center rounded-2xl border border-border bg-secondary/40 px-8 py-16 text-center">
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight">
            Give your STEM club a real home.
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Free to start. Your school gets its own secure, isolated workspace in minutes.
          </p>
          <Button
            size="lg"
            className="mt-8"
            render={
              <Link href="/schools/new">
                Start your school <ArrowRight className="size-4" />
              </Link>
            }
          />
        </Container>
      </section>
    </>
  );
}

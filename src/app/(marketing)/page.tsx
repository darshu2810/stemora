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
import { ALL_ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/config/roles";

const PILLARS = [
  {
    icon: Users,
    tag: "STUDENTS",
    title: "Students",
    description: "One roster for the whole club — invite students, see who's active, and see what each of them is working on.",
  },
  {
    icon: FolderKanban,
    tag: "PROJECTS",
    title: "Projects & boards",
    description: "Every build gets a team, a category, a deadline, and a board that tracks it from backlog to done.",
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
    description: "Meetings, workshops, showcases, and competition days on one schedule the whole club can see.",
  },
  {
    icon: Library,
    tag: "RESOURCES",
    title: "Resources",
    description: "Rulebooks, guides, and starter kits that stay with the club instead of in someone's inbox.",
  },
  {
    icon: Megaphone,
    tag: "ANNOUNCEMENTS",
    title: "Announcements",
    description: "Reach every student in the club at once, with the notices that matter pinned to the top.",
  },
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
              One workspace for your school&apos;s STEM Club.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Students, projects, competitions, events, resources, and announcements — built for how
              a school STEM Club actually runs, in a secure workspace that belongs to your school alone.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                render={
                  <Link href="/register?as=school">
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
              Everything the club needs, nothing you have to stitch together.
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
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Three roles, no more</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              The right view for whoever&apos;s logged in.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Platform Owner, School Admin, Student. A student leading a project leads that project —
              it doesn&apos;t change their account.
            </p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {ALL_ROLES.map((role) => (
              <div key={role} className="bg-card p-6">
                <h3 className="font-display font-semibold">{ROLE_LABELS[role]}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container className="flex flex-col items-center rounded-2xl border border-border bg-secondary/40 px-8 py-16 text-center">
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight">
            Give your STEM Club a real home.
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Free to start. Your school gets its own secure, isolated workspace in minutes.
          </p>
          <Button
            size="lg"
            className="mt-8"
            render={
              <Link href="/register?as=school">
                Start your school <ArrowRight className="size-4" />
              </Link>
            }
          />
        </Container>
      </section>
    </>
  );
}

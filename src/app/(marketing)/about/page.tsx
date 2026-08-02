import type { Metadata } from "next";
import { Container } from "@/components/shared/container";

export const metadata: Metadata = { title: "About — STEMORA" };

export default function AboutPage() {
  return (
    <Container className="py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">About</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
          Built for the club, not the classroom.
        </h1>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>
            Most school software is built around courses and semesters. A STEM Club doesn&apos;t run on
            that schedule — it runs on build seasons, competition deadlines, and whoever shows up to
            the meeting that week.
          </p>
          <p>
            So STEMORA is built around one thing: a school&apos;s STEM Club. One school, one club, one
            roster. Every project, competition, resource, event, and announcement belongs to that
            club, which is why there is never a question about where something lives or who can see
            it.
          </p>
          <p>
            We&apos;re starting with a single pilot school and growing from there. Every school that
            joins gets the same workspace, isolated from every other school, permissioned by role,
            and fast enough to use in a 45-minute meeting.
          </p>
        </div>
      </div>
    </Container>
  );
}

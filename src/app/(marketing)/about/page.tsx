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
            Most school software is built around courses and semesters. STEM clubs don&apos;t run on
            that schedule — they run on build seasons, competition deadlines, and whoever shows up
            to the meeting that week.
          </p>
          <p>
            STEMORA gives every club its own workspace inside a secure, isolated school
            environment: a classroom for assignments, a project space for the actual build, a
            channel for the group chat that used to live in five different apps, and a profile
            that follows a student past graduation.
          </p>
          <p>
            We&apos;re building this as infrastructure for STEM education at global scale — every
            school gets the same tools, isolated from every other school, permissioned by role,
            and fast enough to use in a 45-minute meeting.
          </p>
        </div>
      </div>
    </Container>
  );
}

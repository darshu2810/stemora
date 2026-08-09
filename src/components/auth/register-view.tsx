"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applyForSchool, registerStudent, type AuthResult } from "@/app/(auth)/actions";
import type { JoinableSchool } from "@/lib/db/queries";

export type RegisterSection = "student" | "school";

function ErrorNote({ error }: { error: string | undefined }) {
  if (!error) return null;
  return (
    <p className="flex items-start gap-2 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      {error}
    </p>
  );
}

/**
 * A student asking to join a club that is already on STEMORA. The school is
 * chosen from the registered list rather than typed, so a request can only ever
 * point at a real club — and the club head still has to accept it.
 */
function StudentForm({ schools }: { schools: JoinableSchool[] }) {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(
    registerStudent,
    undefined,
  );

  const items = React.useMemo(
    () => Object.fromEntries(schools.map((s) => [s.id, s.name])),
    [schools],
  );

  if (schools.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">No schools are on STEMORA yet</p>
        <p className="mt-1">
          A student account has to belong to a club that already exists. Ask whoever runs your STEM
          Club to register the school first — then come back and pick it from this list.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mt-4 text-sm text-muted-foreground">
        Ask to join your school&apos;s STEM Club. Your club head sees the request and decides — you
        can log in as soon as they accept you.
      </p>

      <form action={formAction} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            required
            autoComplete="name"
            placeholder="Aarav Sharma"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="student-email">School email</Label>
          <Input
            id="student-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@student.gmis.sch.id"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolId">School you want to join</Label>
          <Select items={items} name="schoolId">
            <SelectTrigger id="schoolId" className="w-full">
              <SelectValue placeholder="Choose your school" />
            </SelectTrigger>
            <SelectContent>
              {schools.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <span className="flex flex-col items-start gap-0">
                    <span>{s.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.district ? `${s.clubName} · ${s.district}` : s.clubName}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="student-password">Password</Label>
          <Input
            id="student-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </div>

        <ErrorNote error={state?.error} />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending your request…" : "Ask to join"}
        </Button>
      </form>
    </>
  );
}

/** Bringing a whole school onto STEMORA. Reviewed by the founders, not a club head. */
function SchoolAdminForm() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(
    applyForSchool,
    undefined,
  );

  return (
    <>
      <p className="mt-4 text-sm text-muted-foreground">
        Tell us about your school. The founders review every request before a STEM Club goes live —
        you&apos;ll go on the waitlist once you submit.
      </p>

      <form action={formAction} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="schoolName">School name</Label>
          <Input id="schoolName" name="schoolName" required placeholder="GMIS Jakarta" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clubName">STEM Club name</Label>
          <Input id="clubName" name="clubName" required placeholder="GMIS STEM Club" />
          <p className="text-xs text-muted-foreground">
            Each school runs exactly one STEM Club. This is what your students will see.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolDomain">School email domain (optional)</Label>
          <Input id="schoolDomain" name="schoolDomain" placeholder="gmis.sch.id" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required placeholder="Jakarta" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" required placeholder="Indonesia" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminName">Your full name</Label>
          <Input id="adminName" name="adminName" required placeholder="Ms. Priya Menon" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-email">Your school email</Label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@gmis.sch.id"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </div>

        <ErrorNote error={state?.error} />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Submitting your application…" : "Apply for access"}
        </Button>
      </form>
    </>
  );
}

/**
 * One register page, two ways in. They are genuinely different requests — a
 * student joins a club that exists and is accepted by its club head; a School
 * Admin brings a new school and is approved by the founders — so they are
 * separated here rather than folded into one form with a role picker.
 */
export function RegisterView({
  schools,
  defaultSection,
}: {
  schools: JoinableSchool[];
  defaultSection: RegisterSection;
}) {
  return (
    <div className="w-full max-w-sm py-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Join STEMORA</h1>

      <Tabs defaultValue={defaultSection} className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="student">
            <GraduationCap className="size-4" />
            Student
          </TabsTrigger>
          <TabsTrigger value="school">
            <ShieldCheck className="size-4" />
            School Admin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student">
          <StudentForm schools={schools} />
        </TabsContent>
        <TabsContent value="school">
          <SchoolAdminForm />
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

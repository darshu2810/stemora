"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applyForSchool, type AuthResult } from "@/app/(auth)/actions";

export default function NewSchoolPage() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(
    applyForSchool,
    undefined,
  );

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Apply for STEMORA</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Tell us about your school. The founders review every request before a STEM Club goes live —
        you&apos;ll go on the waitlist once you submit.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
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
          <Label htmlFor="email">Your school email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@gmis.sch.id"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
        </div>

        {state?.error ? (
          <p className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Submitting your application…" : "Apply for access"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

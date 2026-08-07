"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, type AuthResult } from "@/app/(auth)/actions";

function ForgotPasswordForm() {
  const sent = useSearchParams().get("sent") === "1";
  const [, formAction, pending] = useActionState<AuthResult, FormData>(
    requestPasswordReset,
    undefined,
  );

  if (sent) {
    return (
      <div className="w-full max-w-sm">
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-5" strokeWidth={1.75} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          If that address has an account, we&apos;ve sent it a link to set a new password. The link
          is good for one hour.
        </p>
        <Button variant="outline" className="mt-8 w-full" render={<Link href="/login">Back to log in</Link>} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Forgot your password?</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Enter your school email and we&apos;ll send you a link to set a new one.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@gmis.sch.id" />
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <React.Suspense fallback={<div className="w-full max-w-sm" />}>
      <ForgotPasswordForm />
    </React.Suspense>
  );
}

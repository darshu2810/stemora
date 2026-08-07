"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { AlertCircle, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type AuthResult } from "@/app/(auth)/actions";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const checkEmail = params.get("check_email") === "1";
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(signIn, undefined);

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Welcome back to your school&apos;s STEM Club.
      </p>

      {checkEmail ? (
        <div className="mt-6 flex gap-2.5 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <MailCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            Check your inbox and confirm your email address, then log in here.
          </p>
        </div>
      ) : null}

      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="next" value={next} />

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>

        {state?.error ? (
          <p className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to STEMORA?{" "}
        <Link href="/schools/new" className="font-medium text-primary hover:underline">
          Register your school
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="w-full max-w-sm" />}>
      <LoginForm />
    </React.Suspense>
  );
}

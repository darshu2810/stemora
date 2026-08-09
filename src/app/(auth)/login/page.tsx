"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { AlertCircle, GraduationCap, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn, resendConfirmation, type AuthResult } from "@/app/(auth)/actions";

/**
 * Both roles sign in with the same email and password — the sections exist to
 * point each of them at the right way *in*, which is where they actually
 * differ: a student joins a school that is already here, a School Admin brings
 * one. Nothing about the split is a security boundary; the account's role is
 * read from the database after the password checks out.
 */
const SECTIONS = {
  student: {
    label: "Student",
    icon: GraduationCap,
    blurb: "Sign in to your school's STEM Club.",
    emailLabel: "School email",
    placeholder: "you@student.gmis.sch.id",
    footer: { text: "New here?", href: "/register", link: "Join your school's club" },
  },
  school: {
    label: "School Admin",
    icon: ShieldCheck,
    blurb: "Sign in to run your school's STEM Club.",
    emailLabel: "Your school email",
    placeholder: "you@gmis.sch.id",
    footer: { text: "New to STEMORA?", href: "/register?as=school", link: "Register your school" },
  },
} as const;

type SectionKey = keyof typeof SECTIONS;

function SignInForm({
  section,
  next,
  onUnconfirmed,
}: {
  section: SectionKey;
  next: string;
  onUnconfirmed: () => void;
}) {
  const copy = SECTIONS[section];
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(signIn, undefined);

  // An unconfirmed address is the one failure the password can't fix, so it has
  // to raise the resend panel above rather than just print a message.
  const unconfirmed = state?.error?.startsWith("Confirm your email") ?? false;
  React.useEffect(() => {
    if (unconfirmed) onUnconfirmed();
  }, [unconfirmed, onUnconfirmed]);

  return (
    <>
      <p className="mt-4 text-sm text-muted-foreground">{copy.blurb}</p>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="next" value={next} />

        <div className="space-y-2">
          <Label htmlFor={`${section}-email`}>{copy.emailLabel}</Label>
          <Input
            id={`${section}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={copy.placeholder}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`${section}-password`}>Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id={`${section}-password`}
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
        {copy.footer.text}{" "}
        <Link href={copy.footer.href} className="font-medium text-primary hover:underline">
          {copy.footer.link}
        </Link>
      </p>
    </>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const checkEmail = params.get("check_email") === "1";
  const resent = params.get("resent") === "1";
  const pendingEmail = params.get("email") ?? "";
  const initial: SectionKey = params.get("as") === "school" ? "school" : "student";

  const [signInUnconfirmed, setSignInUnconfirmed] = React.useState(false);
  const noteUnconfirmed = React.useCallback(() => setSignInUnconfirmed(true), []);

  const [resendState, resendAction, resending] = useActionState<AuthResult, FormData>(
    resendConfirmation,
    undefined,
  );

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Log in</h1>

      {checkEmail || resent || signInUnconfirmed ? (
        <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <div className="flex gap-2.5">
            <MailCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-muted-foreground">
              {resent
                ? "Sent. Open the link in that email, then log in here."
                : "Check your inbox and confirm your email address, then log in here."}
            </p>
          </div>
          <form action={resendAction} className="mt-3 flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="resend-email" className="text-xs text-muted-foreground">
                Didn&apos;t get it?
              </Label>
              <Input
                id="resend-email"
                name="email"
                type="email"
                required
                defaultValue={pendingEmail}
                placeholder="you@gmis.sch.id"
                className="h-8"
              />
            </div>
            <Button type="submit" variant="outline" size="sm" disabled={resending}>
              {resending ? "Sending…" : "Resend"}
            </Button>
          </form>
          {resendState?.error ? (
            <p className="mt-2 text-xs text-destructive">{resendState.error}</p>
          ) : null}
        </div>
      ) : null}

      <Tabs defaultValue={initial} className="mt-6">
        <TabsList className="w-full">
          {(Object.keys(SECTIONS) as SectionKey[]).map((key) => {
            const Icon = SECTIONS[key].icon;
            return (
              <TabsTrigger key={key} value={key}>
                <Icon className="size-4" />
                {SECTIONS[key].label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(Object.keys(SECTIONS) as SectionKey[]).map((key) => (
          <TabsContent key={key} value={key}>
            <SignInForm section={key} next={next} onUnconfirmed={noteUnconfirmed} />
          </TabsContent>
        ))}
      </Tabs>
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

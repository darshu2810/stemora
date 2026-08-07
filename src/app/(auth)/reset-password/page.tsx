"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword, type AuthResult } from "@/app/(auth)/actions";

/**
 * Reached from a password-reset or invitation email. The link puts a session
 * in place before this page loads, so setting the password is all that's left.
 */
export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState<AuthResult, FormData>(
    updatePassword,
    undefined,
  );

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Set your password</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Choose a password you don&apos;t use anywhere else.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} placeholder="••••••••" />
        </div>

        {state?.error ? (
          <p className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {state.error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Saving…" : "Save password"}
        </Button>
      </form>
    </div>
  );
}

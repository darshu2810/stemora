"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/db/actions";

type Action = (prev: ActionResult | undefined, fd: FormData) => Promise<ActionResult>;

/**
 * Wraps a Server Action in a form that shows its error inline and closes the
 * dialog it lives in once the write succeeds. Every mutation in the app goes
 * through this, so failures surface the same way everywhere.
 */
export function ActionForm({
  action,
  onSuccess,
  children,
  className = "space-y-4",
}: {
  action: Action;
  onSuccess?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  React.useEffect(() => {
    if (state?.ok) onSuccess?.();
    // onSuccess is a fresh closure each render; the state transition is the signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className={className}>
      {children}
      {state && !state.ok ? (
        <p className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

/** Submit button that disables itself while the action is in flight. */
export function SubmitButton({
  children,
  pendingLabel,
  className,
  variant,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className} variant={variant}>
      {pending ? (pendingLabel ?? "Saving…") : children}
    </Button>
  );
}

/**
 * A one-click action — delete, cancel, move — with no fields of its own.
 * `fields` become hidden inputs.
 */
export function ActionButton({
  action,
  fields,
  children,
  variant = "ghost",
  size,
  className,
  ariaLabel,
}: {
  action: Action;
  fields: Record<string, string>;
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  ariaLabel?: string;
}) {
  const [, formAction] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  return (
    <form action={formAction} className="contents">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <Button type="submit" variant={variant} size={size} className={className} aria-label={ariaLabel}>
        {children}
      </Button>
    </form>
  );
}

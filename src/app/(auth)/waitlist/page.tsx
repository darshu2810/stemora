import Link from "next/link";
import { Clock, Mail, Phone, XCircle, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { applicationFor } from "@/lib/auth/session";
import { founderContact, hasFounderContact } from "@/config/founders";
import { signOut } from "@/app/(auth)/actions";

/**
 * Where a school waits. This page is terminal on purpose: it never redirects
 * onward, which is what guarantees an applicant cannot be bounced between the
 * registration form and the login page.
 *
 * It serves two visitors. Someone who has just submitted the form has no
 * session yet — confirmation is still required — so they see the generic
 * acknowledgement. Someone signed in sees the real state of their own request.
 */
export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { submitted } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const application = user ? await applicationFor(user.id) : null;
  const rejected = application?.status === "rejected";

  return (
    <div className="w-full max-w-md">
      <div
        className={
          rejected
            ? "flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive"
            : "flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"
        }
      >
        {rejected ? <XCircle className="size-5" strokeWidth={1.75} /> : <Clock className="size-5" strokeWidth={1.75} />}
      </div>

      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
        {rejected ? "Your STEMORA application was not approved" : "Your STEM Club is on the waitlist"}
      </h1>

      {rejected ? (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            The founders reviewed the request for{" "}
            <span className="font-medium text-foreground">{application.schoolName}</span> and
            weren&apos;t able to approve it.
          </p>
          {application.rejectionReason ? (
            <p className="mt-3 rounded-lg border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
              {application.rejectionReason}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks for your interest in STEMORA. The founders will review your request and approve
            your school before you can access the platform.
          </p>
          {application ? (
            <p className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{application.schoolName}</span> ·
              submitted {formatDate(application.submittedAt)} · still under review
            </p>
          ) : null}
        </>
      )}

      {submitted === "1" && !user ? (
        <div className="mt-6 flex gap-2.5 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
          <MailCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            We also sent a link to confirm your email address. Confirming it secures your account —
            it doesn&apos;t approve your school, and you don&apos;t need to wait for it before we
            review your request.
          </p>
        </div>
      ) : null}

      {hasFounderContact ? (
        <div className="mt-6 rounded-lg border border-border bg-card p-4">
          <p className="text-sm font-medium">For faster access, contact the founder</p>
          <div className="mt-3 space-y-2">
            {founderContact.email ? (
              <a
                href={`mailto:${founderContact.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="size-4 shrink-0" /> {founderContact.email}
              </a>
            ) : null}
            {founderContact.phone ? (
              <a
                href={`tel:${founderContact.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="size-4 shrink-0" /> {founderContact.phone}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex items-center gap-3">
        {user ? (
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        ) : (
          <Button render={<Link href="/login">Go to log in</Link>} variant="outline" size="sm" />
        )}
        <Button render={<Link href="/">Back to home</Link>} variant="ghost" size="sm" />
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Phone, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { applicationFor, landingForUserWithoutWorkspace } from "@/lib/auth/session";
import { founderContact, hasFounderContact } from "@/config/founders";
import { signOut } from "@/app/(auth)/actions";

export const metadata = { title: "Application not approved · STEMORA" };

/**
 * Where a school applicant lands once the founders have turned their request
 * down. Terminal, and deliberately separate from /waitlist: being refused and
 * still being under review are different answers, and showing the waitlist to
 * someone who has already had a decision tells them the opposite of the truth.
 */
export default async function ApplicationRejectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const application = await applicationFor(user.id);

  // Reapplied, approved on a second look, or never applied at all — in each
  // case this page is no longer where they belong.
  if (application?.status !== "rejected") {
    redirect(await landingForUserWithoutWorkspace(user.id));
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="size-5" strokeWidth={1.75} />
      </div>

      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
        Your STEMORA application was not approved
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        The founders reviewed the request for{" "}
        <span className="font-medium text-foreground">{application.schoolName}</span>, submitted{" "}
        {formatDate(application.submittedAt)}, and weren&apos;t able to approve it. This is a
        decision, not a queue — nothing further happens on its own.
      </p>

      {application.rejectionReason ? (
        <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Reason given
          </p>
          <p className="mt-1 text-sm text-foreground">{application.rejectionReason}</p>
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
          No reason was recorded. The founders can tell you more.
        </p>
      )}

      <div className="mt-6 rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium">What you can do next</p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Talk to the founders first — if something in the request was wrong or incomplete, they can
          tell you what to change. You can then submit a fresh application for your school.
        </p>
        {hasFounderContact ? (
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
        ) : null}
        <Button
          render={<Link href="/register?as=school">Submit a new application</Link>}
          variant="outline"
          size="sm"
          className="mt-4"
        />
      </div>

      <p className="mt-6 font-mono text-xs text-muted-foreground">Signed in as {user.email}</p>

      <div className="mt-4 flex items-center gap-3">
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Log out
          </Button>
        </form>
        <Button render={<Link href="/">Back to home</Link>} variant="ghost" size="sm" />
      </div>
    </div>
  );
}

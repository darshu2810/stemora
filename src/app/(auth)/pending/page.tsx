import { redirect } from "next/navigation";
import { Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getBlockedReason, landingForUserWithoutWorkspace } from "@/lib/auth/session";
import { signOut } from "@/app/(auth)/actions";

export const metadata = { title: "Waiting to be accepted · STEMORA" };

/**
 * Where a student waits after asking to join a club. Terminal: it never
 * redirects onward while the request stands, so there is no pair of rules that
 * can bounce someone between here and the register form.
 */
export default async function PendingPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const reason = await getBlockedReason(auth.user.id);

  // Accepted, declined, or never asked — whatever happened, this page is no
  // longer the truth about where they stand.
  if (reason !== "pending") redirect(await landingForUserWithoutWorkspace(auth.user.id));

  const { data: membership } = await supabase
    .from("school_members")
    .select("schools(name, club_name)")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  const school = membership?.schools as unknown as
    | { name: string; club_name: string }
    | null
    | undefined;

  return (
    <div className="w-full max-w-sm">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Hourglass className="size-5" strokeWidth={1.75} />
      </div>

      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
        Waiting to be accepted
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {school
          ? `Your request to join ${school.club_name} at ${school.name} is with the club head. Once they accept you, log in here and you're in.`
          : "Your request is with the club head. Once they accept you, log in here and you're in."}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Nothing else is needed from you. If it&apos;s taking a while, the fastest fix is to ask your
        club head directly — they accept requests from their Students page.
      </p>

      <p className="mt-6 font-mono text-xs text-muted-foreground">
        Signed in as {auth.user.email}
      </p>

      <form action={signOut}>
        <Button type="submit" variant="outline" className="mt-6 w-full">
          Log out
        </Button>
      </form>
    </div>
  );
}

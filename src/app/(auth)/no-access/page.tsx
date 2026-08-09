import { redirect } from "next/navigation";
import { Lock, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { getBlockedReason } from "@/lib/auth/session";
import { signOut } from "@/app/(auth)/actions";

/**
 * Where a signed-in person lands when their school is closed to them. It says
 * which of the three situations they are in and who can change it — the point
 * is that nobody is left staring at an empty dashboard wondering what broke.
 */
export default async function NoAccessPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const reason = await getBlockedReason(auth.user.id);
  // Access was restored while they were away, or they never had a school.
  if (!reason) redirect("/login");
  // Nobody has refused a waiting student anything; that has its own page.
  if (reason === "pending") redirect("/pending");

  const copy = {
    invited: {
      icon: MailCheck,
      title: "Your invitation is still waiting",
      body: "Open the invitation email and set your password. That is what turns the invitation into an account — until then there is nothing here to show you.",
    },
    suspended: {
      icon: Lock,
      title: "Your access is paused",
      body: "Your School Admin has paused your access to the STEM Club workspace. Your projects and work are untouched. Ask them to restore it when you're ready to come back.",
    },
    removed: {
      icon: Lock,
      title: "You're not in the STEM Club",
      body: "Either your request to join wasn't accepted, or your access was closed. Your club head can restore it — ask them if you think this is a mistake.",
    },
  }[reason];

  const Icon = copy.icon;

  return (
    <div className="w-full max-w-sm">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{copy.body}</p>
      <p className="mt-4 font-mono text-xs text-muted-foreground">Signed in as {auth.user.email}</p>

      <form action={signOut}>
        <Button type="submit" variant="outline" className="mt-8 w-full">
          Log out
        </Button>
      </form>
    </div>
  );
}

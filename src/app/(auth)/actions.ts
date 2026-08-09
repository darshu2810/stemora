"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { landingForUserWithoutWorkspace } from "@/lib/auth/session";

export type AuthResult = { error: string } | undefined;

/**
 * Where a freshly authenticated user belongs. Access that a School Admin has
 * paused or closed sends them to `/no-access`, which explains why, rather than
 * to a school-registration form they never asked for.
 */
async function destinationFor(userId: string): Promise<string> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("users")
    .select("platform_role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.platform_role === "platform_owner") return "/platform/dashboard";

  const { data: membership } = await supabase
    .from("school_members")
    .select("role, status")
    .eq("user_id", userId)
    .maybeSingle();

  if (membership?.status === "active") {
    return membership.role === "school_admin" ? "/school/dashboard" : "/student/dashboard";
  }

  return landingForUserWithoutWorkspace(userId);
}

export async function signIn(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // An unconfirmed address is a different problem from a wrong password, and
    // telling someone their details are wrong when the real answer is "you
    // haven't clicked the link yet" sends them back to re-register forever.
    if (error.code === "email_not_confirmed") {
      return {
        error:
          "Confirm your email address first — open the link we sent you. If it never arrived, request a new one below.",
      };
    }
    // Otherwise don't leak whether the address exists.
    return { error: "That email and password don't match an account." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let destination = next || "/school/dashboard";
  if (user) {
    const home = await destinationFor(user.id);
    // A `next` from the login redirect is only honoured for someone who has a
    // workspace to go back to. Anyone waiting, refused, or yet to apply goes
    // to the page that explains their position, whatever they were aiming at.
    const terminal = ["/no-access", "/waitlist", "/schools/new"];
    destination = terminal.includes(home) ? home : next || home;
  }

  revalidatePath("/", "layout");
  redirect(destination);
}

/**
 * Applies to bring a school onto STEMORA.
 *
 * This creates a request, not a workspace. No school row, no membership, no
 * School Admin — those exist only once a Platform Owner approves. Confirming
 * the email address is a separate, purely security concern and does not move
 * the application along.
 */
export async function applyForSchool(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const schoolName = String(formData.get("schoolName") ?? "").trim();
  const clubName = String(formData.get("clubName") ?? "").trim() || "STEM Club";
  const schoolDomain = String(formData.get("schoolDomain") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const adminName = String(formData.get("adminName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!schoolName) return { error: "Enter your school's name." };

  const supabase = await createClient();

  // An account that already exists and belongs to nothing — someone who
  // confirmed their address before applying, or who signed up earlier. Lodge
  // the request against that account rather than trying to sign up again.
  const {
    data: { user: existing },
  } = await supabase.auth.getUser();

  if (existing) {
    const { error } = await supabase.rpc("submit_school_application", {
      p_school_name: schoolName,
      p_club_name: clubName,
      p_school_email_domain: schoolDomain || undefined,
      p_city: city || undefined,
      p_country: country || undefined,
    });

    if (error) return { error: error.message };

    revalidatePath("/", "layout");
    redirect("/waitlist");
  }

  if (password.length < 8) return { error: "Choose a password of at least 8 characters." };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // The school details ride along as user metadata; the on-signup trigger
  // reads them and records the application, so the request exists even though
  // there is no session yet.
  const { data: signUp, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: adminName,
        school_name: schoolName,
        club_name: clubName,
        school_email_domain: schoolDomain,
        city,
        country,
      },
      // Without this the confirmation link resolves against the project's Site
      // URL rather than the route that exchanges the token for a session.
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (signUpError) return { error: signUpError.message };

  // Supabase will not admit that an address is already registered: it returns
  // a user with an empty `identities` array, no error, and no session. Read
  // literally that looks like a fresh signup — which is what made the old form
  // "succeed" on every retry and bounce the visitor round forever.
  if (signUp.user && signUp.user.identities?.length === 0) {
    return {
      error:
        "An account already exists for that email. Log in instead — or if the confirmation email never arrived, ask for a new one from the login page.",
    };
  }

  // A Platform Owner is the gate here, not the mailbox. If the project is
  // configured to withhold a session until the address is confirmed, confirm it
  // server-side and start the session now — the applicant still sees nothing
  // but their own waitlist entry until a founder approves them.
  let signedIn = Boolean(signUp.session);
  if (!signedIn && signUp.user) {
    signedIn = await confirmAndSignIn(signUp.user.id, email, password);
  }

  revalidatePath("/", "layout");
  redirect(signedIn ? "/waitlist" : "/waitlist?submitted=1");
}

/**
 * Marks a new applicant's address as confirmed and signs them in.
 *
 * Email confirmation proves someone controls an address. Founder approval
 * decides whether a school joins STEMORA, and it is the stricter test — the
 * founders review each request by hand. Making an applicant fetch a link before
 * they can even see their own waitlist entry adds a step and a failure mode
 * without adding a guarantee.
 *
 * Returns false when SUPABASE_SERVICE_ROLE_KEY is absent, in which case the
 * caller falls back to the emailed confirmation link rather than stranding
 * anyone.
 */
async function confirmAndSignIn(
  userId: string,
  email: string,
  password: string,
): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.updateUserById(userId, { email_confirm: true });
    if (error) return false;

    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    return !signInError;
  } catch {
    return false;
  }
}

/**
 * Sends the confirmation email again.
 *
 * Needed because re-submitting the registration form cannot do it: a second
 * signUp for an address that already exists is silently ignored by Supabase, so
 * without this an account whose first confirmation email never arrived — or
 * arrived pointing at the wrong origin — has no way to ever be confirmed.
 */
export async function resendConfirmation(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email address first." };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/confirm` },
  });

  if (error) return { error: error.message };
  redirect(`/login?resent=1&email=${encodeURIComponent(email)}`);
}

export async function requestPasswordReset(
  _prev: AuthResult,
  formData: FormData,
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  // Always the same answer, whether or not the address is registered.
  redirect("/forgot-password?sent=1");
}

export async function updatePassword(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: "Choose a password of at least 8 characters." };
  if (password !== confirm) return { error: "Those two passwords don't match." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const destination = user ? await destinationFor(user.id) : "/login";

  revalidatePath("/", "layout");
  redirect(destination);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

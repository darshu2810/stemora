"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { error: string } | undefined;

export async function signIn(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Don't leak whether the address exists.
    return { error: "That email and password don't match an account." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let destination = next || "/school/dashboard";
  if (user && !next) {
    const { data: profile } = await supabase
      .from("users")
      .select("platform_role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.platform_role === "platform_owner") {
      destination = "/platform/dashboard";
    } else {
      const { data: membership } = await supabase
        .from("school_members")
        .select("role")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      destination = !membership
        ? "/schools/new"
        : membership.role === "school_admin"
          ? "/school/dashboard"
          : "/student/dashboard";
    }
  }

  revalidatePath("/", "layout");
  redirect(destination);
}

export async function registerSchool(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const schoolName = String(formData.get("schoolName") ?? "").trim();
  const clubName = String(formData.get("clubName") ?? "").trim() || "STEM Club";
  const district = String(formData.get("district") ?? "").trim();
  const adminName = String(formData.get("adminName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) return { error: "Choose a password of at least 8 characters." };

  const supabase = await createClient();

  // Already signed in but school-less (e.g. came back after confirming email):
  // skip straight to creating the school.
  const {
    data: { user: existing },
  } = await supabase.auth.getUser();

  if (!existing) {
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: adminName } },
    });

    if (signUpError) {
      return { error: signUpError.message };
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Email confirmation is on: there is no session yet, so the school gets
    // created when they come back through the confirmation link.
    if (!session) {
      redirect("/login?check_email=1");
    }
  }

  const { error } = await supabase.rpc("register_school", {
    p_name: schoolName,
    p_district: district || undefined,
    p_club_name: clubName,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/school/dashboard");
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

  let destination = "/login";
  if (user) {
    const { data: membership } = await supabase
      .from("school_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    destination = !membership
      ? "/schools/new"
      : membership.role === "school_admin"
        ? "/school/dashboard"
        : "/student/dashboard";
  }

  revalidatePath("/", "layout");
  redirect(destination);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

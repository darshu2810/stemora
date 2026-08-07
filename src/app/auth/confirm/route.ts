import { type NextRequest, NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for every link Supabase emails — confirmation, invitation, and
 * password reset. Exchanges the one-time token for a session, then sends the
 * visitor where that kind of link is meant to go.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login?error=link_invalid`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=link_expired`);
  }

  // An invited student and a password reset both need to choose a password.
  if (!next && (type === "invite" || type === "recovery")) {
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  return NextResponse.redirect(`${origin}${next ?? "/login"}`);
}

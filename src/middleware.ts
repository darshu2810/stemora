import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/features",
  "/contact",
  "/login",
  // Applying is where an account is created, so it has to be reachable without
  // one. A signed-in visitor is routed onward below.
  "/schools/new",
  // Terminal: reachable signed in or out, and never redirects onward. This is
  // what an applicant sees instead of being bounced back to the form.
  "/waitlist",
  "/forgot-password",
  "/reset-password",
  "/invite",
  "/auth",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Refreshes the Supabase session cookie on every request, and keeps signed-out
 * visitors out of the dashboards. This is a coarse gate for UX — the real
 * boundary is RLS in Postgres plus the role check each page runs.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Do not remove: this call is what refreshes an expiring session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !isPublic(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // A signed-in user has no reason to sit on the entry pages. Each state below
  // resolves to exactly one destination, and /waitlist is terminal, so there is
  // no pair of rules that can hand a visitor back and forth.
  const ENTRY_PATHS = ["/login", "/schools/new", "/waitlist"];
  if (user && ENTRY_PATHS.includes(pathname)) {
    const goTo = (to: string) => {
      const url = request.nextUrl.clone();
      url.pathname = to;
      url.search = "";
      return NextResponse.redirect(url);
    };

    const [{ data: profile }, { data: membership }] = await Promise.all([
      supabase.from("users").select("platform_role").eq("id", user.id).maybeSingle(),
      supabase
        .from("school_members")
        .select("role")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle(),
    ]);

    if (profile?.platform_role === "platform_owner") {
      return pathname === "/platform/dashboard" ? response : goTo("/platform/dashboard");
    }

    if (membership) {
      return goTo(membership.role === "school_admin" ? "/school/dashboard" : "/student/dashboard");
    }

    // No workspace. Whether they are waiting, refused, or have yet to apply is
    // the application's business, not the login page's.
    const { data: application } = await supabase
      .from("school_applications")
      .select("status")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const waiting = application && application.status !== "approved";

    if (waiting) return pathname === "/waitlist" ? response : goTo("/waitlist");
    // Never applied: the form is the only place that helps.
    if (pathname !== "/schools/new") return goTo("/schools/new");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/features",
  "/contact",
  "/login",
  // Registration is where an account is created, so it has to be reachable
  // without one. A signed-in visitor is redirected away below.
  "/schools/new",
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

  // A signed-in user has no reason to sit on the login page.
  if (user && (pathname === "/login" || pathname === "/schools/new")) {
    const { data: membership } = await supabase
      .from("school_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (membership) {
      const url = request.nextUrl.clone();
      url.pathname =
        membership.role === "school_admin" ? "/school/dashboard" : "/student/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    // No membership yet: /schools/new is exactly where they should be.
    if (pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/schools/new";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

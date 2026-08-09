import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { SUPABASE_URL } from "@/lib/env";

/**
 * Service-role client. Bypasses RLS, so it is confined to the two things no
 * anon-key client can do: creating a student's account with its address already
 * confirmed, and emailing a School Admin's invitation through the Auth admin
 * API.
 *
 * Never import this from a Client Component — `server-only` makes that a build
 * error rather than a leaked key. The variable is deliberately not prefixed
 * `NEXT_PUBLIC_`, so Next.js will not inline it into the browser bundle.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Locally: add it to .env.local. " +
        "On Vercel: Project → Settings → Environment Variables, scoped to Production " +
        "(and Preview if you use it), then redeploy. It must never be prefixed " +
        "NEXT_PUBLIC_ — that would publish it to every browser.",
    );
  }
  return createClient<Database>(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

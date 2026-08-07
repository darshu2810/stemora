import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Service-role client. Bypasses RLS, so it is used for exactly one thing:
 * sending a student their invitation through the Auth admin API, which no
 * anon-key client can do.
 *
 * Never import this from a Client Component — `server-only` makes that a
 * build error rather than a leaked key.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set — add it to .env.local to send invitations.",
    );
  }
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

/** Supabase client for Client Components. Guarded by RLS, never privileged. */
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}

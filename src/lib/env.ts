/**
 * The environment variables the app cannot start without.
 *
 * NEXT_PUBLIC_* values are inlined into the bundle at build time, so a missing
 * one does not fail the build — it ships the literal `undefined` and every
 * request then dies inside middleware with a Supabase error that names neither
 * the variable nor the environment it was missing from. Reading them through
 * here turns that into a build failure that says which variable is absent.
 *
 * Each is referenced as a full `process.env.NAME` literal, which is what lets
 * Next.js substitute the value at build time.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} is not set. Locally: add it to .env.local. On Vercel: Project → ` +
        `Settings → Environment Variables, scoped to the Production environment, ` +
        `then rebuild — NEXT_PUBLIC_* values are baked in at build time, so ` +
        `saving a variable does not fix an already-built deployment.`,
    );
  }
  return value;
}

export const SUPABASE_URL = required(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

export const SUPABASE_ANON_KEY = required(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

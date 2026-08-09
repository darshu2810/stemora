# Deploying STEMORA

A Next.js 16 app backed by Supabase — Postgres, Auth, and Row Level Security.
It **will not start without environment variables**, and one of them is a
secret that must never reach a browser.

## Environment variables

All five live in `.env.example`. Four are required.

| Variable | Where it runs | Required | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | yes | Publishable. Inlined at build time. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser + server | yes | Publishable, guarded by RLS. Inlined at build time. |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | yes | Secret. Bypasses RLS entirely. |
| `NEXT_PUBLIC_SITE_URL` | browser + server | yes | Real deployed origin, no trailing slash. |
| `NEXT_PUBLIC_FOUNDER_EMAIL` / `_PHONE` | browser | no | Blank simply hides the contact line. |

### `SUPABASE_SERVICE_ROLE_KEY` is required in production

Two flows fail without it, and both fail loudly rather than degrading:

- **Student registration.** Accounts are created server-side through the Auth
  admin API with the address already confirmed, because School Admin approval —
  not an emailed link — is what grants access. There is no fallback path: if the
  key is missing, registration returns a configuration error and creates
  nothing.
- **Student invitations.** The School Admin's "Invite Student" button uses the
  same admin API. The Students page shows a warning banner when the key is
  absent.

Set it in **Vercel → Project → Settings → Environment Variables**, scoped to
**Production** (and Preview, if you deploy previews). Never prefix it
`NEXT_PUBLIC_` — that would inline it into the client bundle and publish it to
every visitor. It is read only from `src/lib/supabase/admin.ts`, which carries
`import "server-only"` so that importing it from a Client Component is a build
error.

`NEXT_PUBLIC_*` values are baked into the bundle **at build time**, so saving a
variable in Vercel does not fix an already-built deployment — redeploy after
changing any of them.

## Pre-flight

```bash
npm run verify
```

Runs `tsc --noEmit`, `eslint --max-warnings=0`, and `next build` in sequence.
All three must pass.

## Vercel

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Accept the detected settings — Framework: Next.js, Build: `next build`,
   Install: `npm install`.
4. **Add all four required environment variables before the first deploy.**
   The build fails fast with a message naming the missing variable.
5. Deploy.

Node 20 or newer.

## Supabase configuration

The schema, RLS policies, and triggers are applied as migrations against the
project directly. Two settings are worth checking in the dashboard:

- **Auth → Providers → Email**: students never receive email, but School Admin
  applications and password resets still do. The built-in SMTP is rate-limited
  to a handful of messages per hour — configure a custom SMTP provider before a
  real intake.
- **Auth → Policies**: leaked-password protection (HaveIBeenPwned) is currently
  **off**. Turning it on is one toggle and costs nothing.

## Any Node host (Render, Railway, Fly, a VM)

```bash
npm ci
npm run build
npm run start        # serves on $PORT, default 3000
```

Run it behind a TLS-terminating proxy, with the same environment variables set
and `SUPABASE_SERVICE_ROLE_KEY` kept out of any client-visible config.

## Security posture

- RLS is enabled on all 21 public tables and is the real boundary; the route
  guards in `src/lib/auth/session.ts` are for UX.
- `platform_role` cannot be changed by any application role — the `authenticated`
  role holds `UPDATE` on only `full_name` and `avatar_url`, and a trigger
  refuses the change regardless. Founder accounts are provisioned by an
  administrator through the SQL editor or the service role.
- A school exists only after a Platform Owner approves its application; a
  student reaches the dashboard only after a School Admin accepts them.

See [docs/architecture/authentication.md](docs/architecture/authentication.md).

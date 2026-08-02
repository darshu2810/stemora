# Deploying STEMORA

The MVP is a self-contained Next.js 16 app. It has **no backend, no database,
and no environment variables** — all data comes from fixtures in
`src/lib/mock-data.ts`. That makes it deployable as-is for a pilot demo, and it
means there are no secrets to configure yet.

## Pre-flight

```bash
npm run verify
```

Runs `tsc --noEmit`, `eslint --max-warnings=0`, and `next build` in sequence.
All three must pass. The build should report **25 routes** — if you see more,
a parked module was moved back into `src/app/` unintentionally.

## Vercel (recommended)

The app uses the Next.js defaults Vercel detects automatically.

1. Commit the repo and push it to GitHub/GitLab.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Accept the detected settings — Framework: Next.js, Build: `next build`,
   Output: `.next`, Install: `npm install`. No environment variables needed.
4. Deploy.

Node 20 or newer. Vercel's current default is fine.

## Any Node host (Render, Railway, Fly, a VM)

```bash
npm ci
npm run build
npm run start        # serves on $PORT, default 3000
```

Run it behind a TLS-terminating proxy. `next start` is a long-running process —
use a process manager or the platform's own supervisor.

## Docker

No Dockerfile is checked in. If you need one, add
`output: "standalone"` to `next.config.ts` first and copy `.next/standalone`,
`.next/static`, and `public/` into the image — that keeps it small and avoids
shipping `node_modules`.

## What is *not* ready for production data

The MVP is safe to deploy as a **demo or design pilot**. It is not yet safe to
put real student records into, because:

- **There is no authentication.** The persona switcher in the dashboard header
  is a client-side `localStorage` toggle (`src/lib/mock-session.ts`). Anyone
  who loads the page can view any role.
- **There is no server-side authorization.** Navigation is filtered by
  `src/config/features.ts`, which is a UI concern, not a security boundary.
- **There is no tenant isolation yet.** The schema and RLS policy design are in
  `docs/architecture/`, but nothing enforces them at runtime because there is
  no database.
- **Nothing persists.** Every create/edit action updates React state only and
  resets on reload.

Ship those four before a school enters real data. Until then, deploy behind
Vercel password protection or an equivalent access gate, and say plainly on the
landing page that it is a preview.

## Parked modules and the build

Parked routes live in `src/future-modules/routes/` and are invisible to the
Next.js router, so they add nothing to the bundle. They *are* still type-checked
and linted, so `npm run verify` will catch a shared-component change that breaks
them — fix it there rather than excluding the folder, or re-enabling the module
later becomes a rewrite. See `src/future-modules/README.md`.

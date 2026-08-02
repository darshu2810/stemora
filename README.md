# STEMORA

One workspace for a school's STEM clubs — members, projects, competitions,
events, resources, and announcements.

**Current release: MVP (v1).** Scoped to STEM club management for a single
piloting school. Everything built beyond that scope is parked, not deleted —
see [`src/future-modules/README.md`](src/future-modules/README.md).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` across `src/`, parked modules included |
| `npm run lint` | ESLint, zero warnings tolerated |
| `npm run verify` | typecheck → lint → build. Run before deploying. |

## What ships in the MVP

**Public** — Home, Features, About, Contact, Log in, Register school

**School dashboard** — Dashboard, Members, Projects, Competitions, Events,
Resources, Announcements, Settings

**Student dashboard** — Dashboard, My Projects, My Tasks, Calendar, Resources,
Achievements, Profile

Parked for a later release: the global ecosystem (Discover, directories,
Research Hub, forums, follows, global feed), the platform/super-admin console,
billing and pricing, messaging, clubs, and the leaderboard. Scope is
declared in [`src/config/features.ts`](src/config/features.ts).

## Architecture

- **Framework** — Next.js 16 App Router, React 19, TypeScript strict, Turbopack
- **UI** — shadcn/ui on [Base UI](https://base-ui.com) (**not** Radix — use the
  `render` prop, not `asChild`), Tailwind CSS v4 with CSS-variable theming
- **Routing** — route groups `(marketing)`, `(auth)`, plus `/school` and
  `/student` dashboard shells
- **Multi-tenancy** — every school gets an isolated workspace, keyed by
  `school_id` and enforced with Postgres RLS. Designed, not yet implemented.

Design docs live in [`docs/architecture/`](docs/architecture/); start from
[`ARCHITECTURE.md`](ARCHITECTURE.md).

## Deployment

See [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Before a real pilot

The app currently runs on fixture data (`src/lib/mock-data.ts`) with a
client-side persona switcher standing in for auth. These must land before a
school uses it with real student data:

1. **Backend** — Supabase project, schema from
   `docs/architecture/database-schema.md`, RLS policies enforcing tenant
   isolation.
2. **Real authentication** — replace `src/lib/mock-session.ts`; server-side
   authorization on every route, not just nav filtering.
3. **Legal pages** — Terms and Privacy. The footer links to them were removed
   because the pages don't exist; a pilot handling minors' data needs both.

# STEMORA

One workspace for a school's STEM Club — students, projects, competitions,
events, resources, and announcements.

**Current release: MVP (v1).** Every school on STEMORA runs exactly one STEM
Club. Students belong to that club, and every project, competition, resource,
event, and announcement belongs to it too. There is no concept of multiple
clubs anywhere in the product.

```
Platform
   ↓
School
   ↓
ONE STEM Club
   ↓
Students
```

Subject areas — Robotics, Programming, Artificial Intelligence, Engineering,
Electronics, Mathematics, Research, Physics, Environmental Science — are
**project categories**, never clubs.

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
| `npm run typecheck` | `tsc --noEmit` across `src/` |
| `npm run lint` | ESLint, zero warnings tolerated |
| `npm run verify` | typecheck → lint → build. Run before deploying. |

## Roles

Three, and only three. A student who leads a project is still a Student —
project leader is an attribute of the project, not an account type.

| Role | Sees |
| --- | --- |
| **Platform Owner** | The schools on STEMORA. Never a school's internal data. |
| **School Admin** | Their school's STEM Club: students, projects, competitions, events, resources, announcements, settings. |
| **Student** | Their projects, tasks, competitions, events, resources, announcements, achievements, and profile. |

## What ships

**Public** — Home, Features, About, Contact, Log in, Register school

**Platform** — Schools

**School Admin** — Dashboard, Students, Projects (+ project boards),
Competitions, Events, Resources, Announcements, Settings

**Student** — Dashboard, My Projects (+ project boards), My Tasks,
Competitions, Events, Resources, Announcements, Achievements, Profile

Every sidebar entry resolves to a working page. There are no feature flags,
no parked routes, and no placeholder screens.

## Architecture

- **Framework** — Next.js 16 App Router, React 19, TypeScript strict, Turbopack
- **UI** — shadcn/ui on [Base UI](https://base-ui.com) (**not** Radix — use the
  `render` prop, not `asChild`), Tailwind CSS v4 with CSS-variable theming
- **Routing** — route groups `(marketing)`, `(auth)`, plus `/platform`,
  `/school`, and `/student` dashboard shells
- **Multi-tenancy** — every school gets an isolated workspace, keyed by
  `school_id` and enforced with Postgres RLS. Designed, not yet implemented.

Design docs live in [`docs/architecture/`](docs/architecture/); start from
[`ARCHITECTURE.md`](ARCHITECTURE.md).

## Demo data

The app runs on fixture data in [`src/lib/mock-data.ts`](src/lib/mock-data.ts):
the fictional GMIS STEM Club at GMIS Jakarta, with 36 fictional students across
Grades 8–12, 11 projects, 9 competitions, 13 resources, 8 announcements, and 10
events. No real student or staff data appears anywhere.

Counts are derived, not typed in: `clubStats` is computed from the fixtures and
project progress is computed from each project's schedule, so no number in the
UI can contradict the data behind it.

## Deployment

See [`DEPLOYMENT.md`](DEPLOYMENT.md).

## Before a real pilot

The app runs on fixture data with a client-side persona switcher standing in
for auth. These must land before a school uses it with real student data:

1. **Backend** — Supabase project, schema from
   `docs/architecture/database-schema.md`, RLS policies enforcing tenant
   isolation.
2. **Real authentication** — replace `src/lib/mock-session.ts`; server-side
   authorization on every route, not just nav filtering.
3. **Legal pages** — Terms and Privacy. A pilot handling minors' data needs both.

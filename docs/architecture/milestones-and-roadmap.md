# Milestones & Development Roadmap

MVP → production, in build order. Each phase is deployable and demoable on its
own; nothing ships half-finished. "Done" for a phase means every feature in it
has loading/empty/error/success states, permissions, validation, and
responsive + accessible UI — not just the happy path.

## Phase 0 — Foundations *(done)*

- Repo scaffold: Next.js + TypeScript + Tailwind + shadcn/ui on Base UI + ESLint.
- Design tokens and the three dashboard shells (platform, school, student).
- **Exit criteria:** `npm run verify` green — typecheck, lint at zero warnings, production build.

## Phase 1 — MVP UI on fixture data *(done)*

Goal: every screen a pilot school will use, working end to end against
fixtures, so the product can be demonstrated and reviewed before any backend
exists.

- The full model: one school → one STEM Club → students, with subject areas as
  project categories ([database-schema.md](database-schema.md)).
- Three roles, no more ([rbac.md](rbac.md)).
- Students, Projects + kanban boards, Competitions, Events, Resources,
  Announcements, Achievements, Student profile.
- Platform console: the schools on STEMORA.
- Shared component library ([component-library.md](component-library.md)).
- **Exit criteria:** every sidebar entry resolves to a working page; every
  number in the UI is derived from the data it describes; no parked routes,
  feature flags, or placeholder screens remain.

## Phase 2 — Backend

Goal: the same UI, backed by real data and real security.

- Supabase project; `supabase/migrations` pipeline; `database.types.ts` generation wired into CI.
- Schema from [database-schema.md](database-schema.md), with RLS enabled in the
  same migration that creates each table.
- Real auth replacing `src/lib/mock-session.ts`: registration via
  `/schools/new`, student invitations, login, password reset
  ([authentication.md](authentication.md)).
- `middleware.ts`: subdomain tenant resolution + auth guard
  ([multi-tenancy.md](multi-tenancy.md)).
- Server-side authorization on every route and mutation — nav filtering is not
  a permission check.
- File uploads wired to Supabase Storage with tenant-isolated paths.
- **Exit criteria:** a School Admin can register a school, invite a student,
  create a project, assign a task, and have that student see and move it —
  fully permissioned, with an RLS test proving a second school cannot read any
  of it.

## Phase 3 — Pilot readiness

- Legal pages: Terms and Privacy. A pilot handling minors' data needs both
  before a single student account is created.
- In-app notifications backed by the `notifications` table, driven by the six
  real notification types.
- Tenant audit log viewer for the School Admin.
- Email: invitations and event reminders (Resend + scheduled Edge Function).
- Playwright coverage of the critical journey per role.
- **Exit criteria:** GMIS Jakarta runs a full term on STEMORA with real students.

## Phase 4 — More schools

- Platform console grows from a list into school management: onboarding,
  status, and audited, time-boxed impersonation-for-support.
- Per-school branding (logo, accent colour).
- MFA required for `platform_owner` and `school_admin`.
- **Exit criteria:** STEMORA staff can onboard and support a second and third
  school without touching the database directly.

## Phase 5 — Scale & hardening

- Load testing against realistic multi-school volume; index and query audit.
- Full accessibility audit (WCAG 2.1 AA) across every page.
- Security review: penetration test, dependency audit, and an exhaustive RLS
  test suite — every table, every role, positive and negative cases.
- Data residency and compliance review (FERPA/COPPA posture).
- Disaster recovery drill: restore from backup, verify tenant isolation held
  through the restore.
- **Exit criteria (production launch gate):** all of the above pass, plus an
  on-call runbook and a status page.

## Cross-phase, continuous

- Every phase adds Playwright coverage for its critical journey per role.
- Every schema change ships as a reviewed migration in `supabase/migrations`,
  never a manual dashboard edit.
- Every new table gets RLS enabled in the same migration that creates it.
- Nothing is added to the sidebar until the page behind it works.

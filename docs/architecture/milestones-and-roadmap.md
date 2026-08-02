# Milestones & Development Roadmap

MVP → production, in build order. Each phase is deployable and demoable on
its own; nothing ships half-finished per `stemora.md`. "Done" for a phase
means every feature in it has loading/empty/error/success states,
permissions, validation, and responsive+accessible UI — not just the happy
path.

## Phase 0 — Foundations (pre-feature)

- Repo scaffold: Next.js + TypeScript + Tailwind + shadcn/ui + ESLint/Prettier + Vitest + Playwright wired up.
- Supabase project provisioned; `supabase/migrations` pipeline; `database.types.ts` generation wired into CI.
- Design tokens + base layout shells (marketing, auth, app, admin) with placeholder content removed only once real content exists.
- `middleware.ts`: tenant resolution + auth guard skeleton (Phase 1 fills in real logic).
- CI/CD on Vercel: preview deployments per PR, `main` → production; Sentry + PostHog wired but quiet until real traffic.
- **Exit criteria:** a logged-out visitor can load the marketing shell; `npm run build`/`test`/`lint` green in CI; no schema yet applied beyond `schools`/`users` skeleton.

## Phase 1 — MVP: one school, one club, core classroom

Goal: a single school can onboard, create a club, invite members, and run
Google-Classroom-equivalent workflows end to end.

- Auth: signup via `/schools/new`, invitations, login, onboarding wizard ([authentication.md](authentication.md)).
- Multi-tenancy: subdomain resolution, RLS on all Phase 1 tables ([multi-tenancy.md](multi-tenancy.md)).
- RBAC: full role hierarchy + permission matrix enforced ([rbac.md](rbac.md)).
- Clubs: create/archive, membership, roles.
- Classroom: announcements, assignments, submissions, grading, materials.
- People directory (basic, no LinkedIn-style richness yet).
- Notifications (in-app only, no email digests yet).
- Core shared component library ([component-library.md](component-library.md)).
- **Exit criteria:** a school admin can sign up, create a club, invite students, post an assignment, have a student submit, and review the submission — fully permissioned, fully responsive, with Playwright coverage of that journey.

## Phase 2 — Projects, Kanban, Calendar

- Project spaces + Kanban boards/cards (GitHub + Trello equivalent).
- File uploads wired to Supabase Storage with tenant-isolated paths (`file_objects`).
- Events & school/club calendar.
- Custom-domain groundwork deferred; per-school branding (logo, accent color) shipped here.
- **Exit criteria:** a club can run a project end-to-end on a Kanban board with attached files and a scheduled event, visible on the school calendar.

## Phase 3 — Communication & Knowledge

- Channels + realtime messaging (Discord equivalent), DMs.
- Wiki pages (Notion equivalent), nested pages.
- Global search across clubs/people/assignments/messages.
- Digest emails (Resend + scheduled Edge Function).
- **Exit criteria:** a club can hold real-time discussion in channels, maintain a living wiki, and members can find anything via search within 2 clicks or one query.

## Phase 4 — Identity & Network (LinkedIn equivalent)

- Rich profiles: bio, skills, links.
- Achievements/badges, awarded by school admins.
- Follows, cross-club activity feed within a school.
- Public profile visibility controls.
- **Exit criteria:** a student's profile is a credible portfolio of their STEM club work, shareable and meaningful outside the platform.

## Phase 5 — Platform Operations & Monetization

- Platform admin console (`admin.stemora.com`): cross-tenant school management, impersonation-for-support (audited, time-boxed).
- Billing: Stripe subscriptions per school, plan gating.
- Custom domains per school.
- MFA required for `platform_owner`/`school_admin`.
- PostHog product analytics dashboards; Sentry alerting thresholds tuned.
- **Exit criteria:** STEMORA staff can operate, support, and bill many schools without touching the database directly.

## Phase 6 — Scale & Hardening

- Load testing against realistic multi-school volume; index/query audit using `get_advisors`-style tooling.
- Partitioning evaluation for high-growth tables (`messages`, `notifications`, `audit_logs`).
- Full accessibility audit (WCAG 2.1 AA) across every page.
- Security review: penetration test / dependency audit, RLS policy exhaustive test suite (every table, every role, positive and negative cases).
- Data residency/compliance review (FERPA/COPPA posture) before onboarding schools with large under-13 populations.
- Disaster recovery drill: restore from backup, verify tenant isolation held through restore.
- **Exit criteria (production launch gate):** all of the above pass, plus on-call runbook and status page exist.

## Cross-phase, continuous

- Every phase adds Playwright coverage for its critical journey per role, not just Phase 1.
- Every schema change ships as a reviewed migration in `supabase/migrations`, never a manual dashboard edit.
- Every new table gets RLS enabled in the same migration that creates it — never a follow-up.

## Immediate next steps once this document is approved

1. Confirm the five open decisions in [ARCHITECTURE.md](../../ARCHITECTURE.md#open-decisions-requiring-your-input-before-implementation).
2. Scaffold Phase 0 (repo, Supabase project, CI/CD).
3. Begin Phase 1 in the order: schema migrations → RLS policies → auth flow → clubs → classroom → UI.

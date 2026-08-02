# Routes & Pages

Tenant resolution is subdomain-based (`riverside.stemora.com`), decided in
[multi-tenancy.md](multi-tenancy.md#tenant-resolution). Route groups below map
to `src/app/(group)/...`. Every page listed ships with loading/empty/error
states, permission checks, and responsive layout per `stemora.md`.

Legend: **Roles** = who can view (⚙ = can also configure). PO=platform_owner,
SA=school_admin, S=student. (platform_owner is STEMORA staff, not a school member.)

## `(marketing)` — public, no subdomain, `stemora.com`

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/features` | Feature tour |
| `/pricing` | Plans (Phase 5, ties to `subscription_plans`) |
| `/security` | Trust/security page (SOC2 posture, data handling) |
| `/about` | Story/mission |
| `/contact` | Contact / sales form |
| `/schools/new` | School signup — creates `schools` row + first `school_admin` |
| `/legal/terms`, `/legal/privacy` | Legal |

## `(auth)` — `stemora.com` and `{slug}.stemora.com`

| Route | Purpose | Roles |
|---|---|---|
| `/login` | Email/password + OAuth | all |
| `/signup` | Only reachable via `/schools/new` (admin) or invitation token | — |
| `/forgot-password`, `/reset-password` | Password recovery | all |
| `/verify-email` | Post-signup verification gate | all |
| `/invite/[token]` | Accept invitation → creates `school_members` row | invited user |
| `/onboarding` | Multi-step: profile, role-specific fields, first club join | all, first login |

## `(app)` — authenticated, tenant-scoped, `{slug}.stemora.com`

| Route | Purpose | Roles |
|---|---|---|
| `/dashboard` | Role-aware home: for students—my assignments/clubs; for admins—school pulse | all |
| `/clubs` | Directory of clubs in this school, search + filter by category | all |
| `/clubs/new` | Create club | SA, O ⚙ |
| `/clubs/[clubId]` | Club overview: pinned announcements, activity feed, quick links | members |
| `/clubs/[clubId]/members` | Member list, roles, invite | members (⚙ club leader) |
| `/clubs/[clubId]/announcements` | Announcement feed | members |
| `/clubs/[clubId]/classroom` | Assignments list | members |
| `/clubs/[clubId]/classroom/assignments/[assignmentId]` | Assignment detail + submission | members (⚙ T/M/O) |
| `/clubs/[clubId]/classroom/assignments/[assignmentId]/submissions` | Grading queue | T, M, O ⚙ |
| `/clubs/[clubId]/classroom/materials` | Shared resources/files | members |
| `/clubs/[clubId]/projects` | Project spaces list | members |
| `/clubs/[clubId]/projects/[projectId]` | Kanban board + files | members |
| `/clubs/[clubId]/channels` | Channel list (sidebar layout) | members |
| `/clubs/[clubId]/channels/[channelId]` | Channel chat | members |
| `/clubs/[clubId]/wiki` | Wiki page tree | members |
| `/clubs/[clubId]/wiki/[pageId]` | Wiki page editor/viewer | members (⚙ editors) |
| `/clubs/[clubId]/settings` | Club settings, archive, danger zone | O ⚙, SA ⚙ |
| `/people` | School-wide member directory (LinkedIn-like) | all |
| `/people/[userId]` | Public profile: bio, skills, achievements, clubs | all |
| `/calendar` | School-wide calendar, merges club events | all |
| `/messages` | Direct messages inbox | all |
| `/messages/[threadId]` | DM thread | participants |
| `/notifications` | Notification center | all |
| `/search` | Global search (clubs, people, assignments, messages) | all |
| `/settings/profile` | Account settings | all |
| `/settings/school` | School branding, domain, integrations, danger zone | SA ⚙ |
| `/settings/school/members` | School-wide member management, bulk invite | SA ⚙ |
| `/settings/school/billing` | Subscription, invoices (Phase 5) | SA ⚙ |
| `/settings/school/audit-log` | Tenant audit log viewer | SA |

## `(platform-admin)` — `admin.stemora.com`, `platform_owner` only

| Route | Purpose |
|---|---|
| `/admin` | Cross-tenant dashboard: total schools, MRR, active users |
| `/admin/schools` | All schools, search/filter, status |
| `/admin/schools/[schoolId]` | School detail: members, plan, impersonate-for-support (audited) |
| `/admin/billing` | Stripe overview, plan management |
| `/admin/analytics` | Platform-wide usage (PostHog rollups) |
| `/admin/audit-logs` | `platform_audit_logs` viewer |
| `/admin/feature-flags` | Rollout controls per school/plan |
| `/admin/support` | Support ticket queue (Phase 5+) |

## Shared chrome

- **Sidebar** (per school): Dashboard, Clubs, People, Calendar, Messages,
  Notifications, Settings — items conditionally rendered by role via
  `config/navigation.ts`, but every underlying route is still enforced
  server-side regardless of what the sidebar shows.
- **Topbar**: school switcher (if user belongs to >1 school), global search,
  notification bell, avatar menu.

## Error/edge routes

`not-found.tsx` (per route group, styled), `error.tsx` (per route group),
`/unauthorized` (403 — wrong role for an otherwise-valid route),
`/school-suspended` (tenant status gate, shown by middleware when
`schools.status != 'active'`).

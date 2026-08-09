# Routes & Pages

Tenant resolution is subdomain-based (`gmis.stemora.com`), decided in
[multi-tenancy.md](multi-tenancy.md#tenant-resolution). Every route below is a
page that exists and works today — there are no feature flags, parked routes,
or placeholder screens in the app.

Legend: PO=platform_owner, SA=school_admin, S=student.

## `(marketing)` — public

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/features` | Feature tour |
| `/about` | Story/mission |
| `/contact` | Contact form |

## `(auth)`

| Route | Purpose | Roles |
|---|---|---|
| `/login` | Sign in — Student and School Admin sections, both email + password | all |
| `/register` | Join STEMORA — Student (asks to join a school) and School Admin (applies to bring one) | — |
| `/schools/new` | Redirects to `/register?as=school`; kept for old links | — |
| `/forgot-password` | Password recovery | all |
| `/reset-password` | Set a password, from a reset or invitation link | all |
| `/pending` | Terminal — student waiting for the club head to accept them | student |
| `/waitlist` | Terminal — school application under review by the founders | — |
| `/application-rejected` | Terminal — school application refused, with the reason | — |
| `/no-access` | Terminal — invited but not accepted, paused, or closed | — |

There is no `/invite/[token]`: student invitations use Supabase's own emailed
link, which lands on `/auth/confirm` and continues to `/reset-password`.

## `/platform` — `platform_owner` only

| Route | Purpose |
|---|---|
| `/platform/dashboard` | The schools on STEMORA, with student and project counts. No access to a school's internal data. |

## `/school` — `school_admin`

Everything here is scoped to the school's one STEM Club.

| Route | Purpose |
|---|---|
| `/school/dashboard` | Club pulse: students, active projects, competitions, upcoming events, pinned announcements, pending tasks, recent activity |
| `/school/students` | The club roster — invite, filter by grade, open a student to see their projects |
| `/school/projects` | Every project, filtered by status and category |
| `/school/projects/[projectId]` | Project detail: progress, deadline, team, and the kanban board |
| `/school/competitions` | Competition register — entries, rosters, levels, results |
| `/school/events` | Meetings, workshops, showcases, competition days; upcoming and past |
| `/school/resources` | Files and links, filed by category |
| `/school/announcements` | Post to the whole club, pin what matters |
| `/school/settings` | School name, STEM Club name, district, and the three roles |

## `/student` — `student`

| Route | Purpose |
|---|---|
| `/student/dashboard` | My tasks, my projects, upcoming events, latest announcement, achievements, my competitions |
| `/student/projects` | The projects I'm on |
| `/student/projects/[projectId]` | The same project board, read-mostly: I move my tasks, I don't add or delete them |
| `/student/tasks` | Every task assigned to me, across projects |
| `/student/competitions` | The club's competition register (read-only) |
| `/student/events` | The club's schedule (read-only) |
| `/student/resources` | The club's library (read-only) |
| `/student/announcements` | The club's announcements (read-only) |
| `/student/achievements` | Club awards earned and still to earn |
| `/student/profile` | Bio, skills, certificates, awards, and projects shipped |

The `/school` and `/student` surfaces share one component per feature
(`CompetitionsView`, `SchoolEventsView`, `ResourceLibraryView`,
`AnnouncementsView`, `ProjectBoardClient`), with a `canManage` prop deciding
whether the create/edit affordances render. One implementation, two audiences —
which is why the two sides can never drift apart.

## Shared chrome

- **Sidebar** — `config/navigation.ts` defines one list per audience
  (`platformNav`, `schoolNav`, `studentNav`). Every entry resolves to a real
  page; the server check on each route is what actually enforces access.
- **Topbar** — theme toggle, notification bell, persona menu. The persona menu
  stands in for real auth until Supabase Auth lands.

## Error/edge routes

`not-found.tsx` (per route group, styled) and `error.tsx` (per route group).
Planned: `/unauthorized` (403 — wrong role for an otherwise-valid route) and
`/school-suspended` (tenant status gate, shown by middleware when
`schools.status != 'active'`).

# Future Modules

Everything in this folder is **finished, working code that is deliberately not
shipping in the MVP**. Nothing here has been deleted or stubbed out.

STEMORA v1 is scoped to STEM club management for a single piloting school. The
global ecosystem, the platform console, messaging, and the follow system were
all built in earlier phases and are parked here until a later release.

## How parking works

A module is parked by **two** changes, and nothing else:

1. **Its route folder moved from `src/app/` to `src/future-modules/routes/`.**
   Next.js only registers routes under `src/app`, so the URLs stop resolving —
   they 404 — while the files stay in the repo.
2. **Its flag in [`src/config/features.ts`](../config/features.ts) is `false`.**
   Nav entries for parked modules are still declared in
   [`src/config/navigation.ts`](../config/navigation.ts) and
   [`src/config/site.ts`](../config/site.ts), tagged with a `feature` key.
   `enabledOnly()` filters them out of the rendered menus.

Shared code the parked routes depend on — `src/components/global/`,
`src/components/community/`, `src/components/messaging/`, `src/lib/mock-global.ts`,
`src/lib/use-follows.ts` — was **left in place under `src/`**. Nothing routed
imports it, so the bundler tree-shakes it out of the production build, but
`tsc` and `eslint` still cover it. Parked code cannot silently rot: `npm run
verify` type-checks and lints this folder along with everything else.

## Re-enabling a module

```bash
# 1. Move the route folder back
mv "src/future-modules/routes/(global)" "src/app/(global)"

# 2. Flip the flag(s) in src/config/features.ts
#    discover: true, schoolDirectory: true, ...

# 3. Verify
npm run verify
```

Step 2 is what restores the navigation entries — no nav file needs editing.

## What is parked, and where

| Module | Flag(s) | Route folder | Public URLs |
| --- | --- | --- | --- |
| Global ecosystem — Discover, Feed, Search, School/Student/Project directories, Research Hub, Competitions, Events, Forums | `discover`, `globalFeed`, `globalSearch`, `schoolDirectory`, `studentDirectory`, `projectShowcase`, `researchHub`, `globalCompetitions`, `eventsDirectory`, `forums` | `routes/(global)/` | `/discover`, `/feed`, `/search`, `/schools`, `/students`, `/projects`, `/research`, `/competitions`, `/events`, `/forums` |
| Platform (super admin) console | `platformConsole`, `billing` | `routes/platform/` | `/platform/*` |
| Public student portfolio | `publicPortfolio` | `routes/portfolio/` | `/portfolio/[handle]` |
| Pricing | `pricing` | `routes/marketing/pricing/` | `/pricing` |
| Clubs | `clubs` | `routes/school/clubs/` | `/school/clubs` |
| School task board | `schoolTasks` | `routes/school/tasks/` | `/school/tasks` |
| School month calendar | `schoolCalendar` | `routes/school/calendar/` | `/school/calendar` |
| Messaging (DMs, project chats) | `messaging` | `routes/school/messages/`, `routes/student/messages/` | `/school/messages`, `/student/messages` |
| Student competitions view | `globalCompetitions` | `routes/student/competitions/` | `/student/competitions` |
| Leaderboard | `leaderboard` | `routes/student/leaderboard/` | `/student/leaderboard` |
| Notifications page | `notificationsPage` | `routes/student/notifications/` | `/student/notifications` |
| Student settings | `studentSettings` | `routes/student/settings/` | `/student/settings` |

The **follow system** (`follows`) has no route of its own — it is
`src/lib/use-follows.ts` plus `src/components/community/follow-button.tsx`,
used by the parked profile and directory pages.

The MVP ships exactly three user roles — Platform Owner, School Admin, and
Student (see [rbac.md](../../docs/architecture/rbac.md)). The parked modules
that existed only to serve other roles — the mentor, university, and company
directories, the school officers page, and the unbuilt sponsor portal — were
**removed outright**, not parked, along with their cards under
`src/components/global/` and their fixtures in `src/lib/mock-global.ts`.

## Notes for whoever revives these

- Two route folders were **moved, not copied**. `git log --follow` on a file
  under `routes/` will cross the move.
- `routes/(global)/` carries its own `layout.tsx` with `GlobalNavbar`. Moving
  the folder back restores that chrome automatically.
- `routes/school/calendar/` and `src/app/student/calendar/` both render
  `SchoolCalendarView`; the student one still ships. The shared component was
  intentionally left under `src/components/calendar/`.
- `routes/student/competitions/` renders the same `CompetitionsView` the live
  `/school/competitions` page uses, with `canManage={false}`.
- `/schools/new` (register a school) lives in `src/app/(auth)/` and **ships in
  the MVP**. It is unrelated to the parked `/schools` directory. When
  `schoolDirectory` is re-enabled, Next.js resolves the static `new` segment
  before the `[slug]` one — this was verified in-browser before parking.

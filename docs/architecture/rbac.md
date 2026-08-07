# RBAC — Roles & Permissions

## Roles

STEMORA ships **three** roles and nothing else. There are no officers,
mentors, teachers, coordinators, moderators, sponsors, or judges — and no
club role, because a school has exactly one STEM Club and every student in the
workspace is in it.

1. **Platform role** (`users.platform_role`): `member` (default) or
   `platform_owner`. Platform Owner is STEMORA staff, unrelated to any single
   school, and never sees a school's internal data.
2. **School role** (`school_members.role`, per `user_role` enum):
   `school_admin` > `student`.

```
platform_owner                         (cross-tenant, STEMORA staff)
   └── school_admin                    (full control of one school's STEM Club)
         └── student                   (member of that STEM Club)
```

### Project leader is not a role

A project has a `leader_id` pointing at a student on its team. That grants
nothing at the account level: the student signs in as a Student, sees the same
navigation as every other student, and cannot manage the club. It exists so the
roster of a project says who is coordinating it.

`config/roles.ts` is the single source of truth for role labels and the
dashboard each role lands on.

## Who can invite whom

| Inviter | Can invite as |
|---|---|
| `school_admin` | student |
| `student` | — (cannot invite) |

A school's first `school_admin` is created when the school is registered; see
[authentication.md](authentication.md). A School Admin can give another active
member School Admin access, and withdraw it.

## Who can sign in

Membership is not a yes/no. `school_members.status` decides whether an account
opens anything, and the School Admin owns it from `/school/students`.

| `status` | Can sign in | What they see | Reached by |
|---|---|---|---|
| `invited` | no | the invitation is still waiting | invitation sent, not yet accepted |
| `active` | yes | their dashboard | accepting the invitation, or being restored |
| `suspended` | no | access is paused | School Admin pauses it |
| `removed` | no | access is closed | School Admin closes it |

Two properties hold this together:

1. **Sending an invitation grants nothing.** The membership row is created at
   `invited`; the `on_auth_user_confirmed` trigger promotes it to `active` only
   when the person actually confirms their email. So a roster count is a count
   of people who can really sign in.
2. **Revocation is enforced in Postgres, not in the UI.** `is_school_member()`
   and `has_school_role()` both require `status = 'active'`, so a paused or
   closed account reads zero rows from every table on its very next request,
   whatever session cookie it still holds. There is no window to close.

A school can never be left without a way in: the `protect_last_school_admin`
trigger refuses to demote, pause, remove, or delete the last active
`school_admin`. It stands down for cascades, so deleting a school still works.

Someone signed in with a non-`active` membership lands on `/no-access`, which
names the situation and offers to log out.

## Permission matrix

`Manage` = create/update/delete. `Contribute` = create/update own content.
`View` = read only. Cells are the **minimum** role required; higher roles
inherit. Every row is scoped to a single school's STEM Club.

| Resource | Manage | Contribute | View |
|---|---|---|---|
| School + STEM Club settings | school_admin | — | school_admin |
| Access (invite, pause, restore, close, grant School Admin) | school_admin | — | school_admin |
| Projects (create/archive, set category, leader, team) | school_admin | — | all students |
| Project tasks (add/delete) | school_admin | move own task across the board | all students |
| Competitions (create, set roster, record result) | school_admin | — | all students |
| Events (add/cancel) | school_admin | — | all students |
| Resources | school_admin | — | all students |
| Announcements | school_admin | — | all students |
| Achievements (award) | school_admin | — | all students |
| Profile | self | self | all students |
| Audit log | school_admin | — | school_admin |
| Platform console (school list) | platform_owner | — | platform_owner |

This table is the spec for both the RLS policies in
[database-schema.md](database-schema.md#row-level-security-strategy) and the
server-side `can()` checks below — they must never diverge; a migration that
changes one updates the other in the same PR.

## Enforcement layers (defense in depth)

1. **Database (RLS) — the real boundary.** Even if every other layer were
   bypassed, Postgres itself refuses cross-tenant or under-privileged reads
   and writes. This is the layer that makes multi-tenancy actually safe.
2. **Server (Route Handlers / Server Actions).** Every mutation calls
   `requireRole(minRole)` or `can(action, resource)` from
   `lib/auth/permissions.ts` *before* touching the database — not for
   security alone, but to return clean 403s with useful messages instead of
   relying on a raw Postgres RLS rejection reaching the client.
3. **Client (UI).** Components hide or disable actions the user can't perform,
   purely for UX — never trusted as the actual gate. In this codebase that is
   the `canManage` prop threaded through the shared views: it decides whether
   the "Create Project" / "Add Event" / "Post Announcement" affordances render,
   and the server check behind them is what actually enforces it.

```ts
// lib/auth/permissions.ts (shape, not final implementation)
type Action = 'manage' | 'contribute' | 'view';
type Resource = 'school' | 'project' | 'task' | 'competition' | 'resource' | 'event' | 'announcement';

export function can(
  membership: { schoolRole: UserRole },
  action: Action,
  resource: Resource,
  context?: { resourceOwnerId?: string; userId?: string }
): boolean;

export async function requireRole(minRole: UserRole): Promise<Session>; // throws AuthorizationError -> mapped to 403
```

## Ownership-scoped exceptions

Some permissions aren't purely role-based:

- A `student` can always view and edit **their own** profile, skills, and
  certificates.
- A `student` assigned a task can move that task across their project's board
  without being able to create or delete tasks.

These are expressed as additional `using`/`with check` clauses in RLS (row
ownership via `author_id = auth.uid()` OR role check), not as a separate
system.

## Impersonation (support tooling, post-pilot)

`platform_owner` may open a read-mostly "view as" session for support
purposes. This is never a silent auth bypass: it requires an explicit
`platform_audit_logs` entry logged *before* the session starts, a visible
"Viewing as support — School X" banner in the UI for the duration, and a
time-boxed (15 min) elevated session that auto-expires.

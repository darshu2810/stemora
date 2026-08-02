# RBAC — Roles & Permissions

## Roles

The MVP ships **three** user roles and nothing else. Two independent role
dimensions:

1. **Platform role** (`users.platform_role`): `member` (default) or
   `platform_owner`. Platform owner is a global super-admin (STEMORA staff),
   unrelated to any single school.
2. **School role** (`school_members.role`, per `user_role` enum):
   `school_admin` > `student`.
3. **Club role** (`club_members.role`): `leader` > `member` — scoped *within a
   single club*, layered on top of the school role (a `student` can be a club
   `leader`; that grants club-management rights for that club only, never
   school-wide rights).

```
platform_owner                         (cross-tenant, STEMORA staff)
   └── school_admin                    (full control of one school)
         └── student                   (participant)

within a club, independent of the above:
club leader > club member
```

`config/roles.ts` is the single source of truth for the hierarchy order (used
by `has_school_role()` in Postgres and by the identical TypeScript
`hasRole()` helper — kept in lockstep intentionally, see enforcement layers
below).

## Who can invite whom

| Inviter | Can invite as |
|---|---|
| `school_admin` | school_admin, student |
| `student` who is a club leader | student (club-scoped invite only) |
| `student` | — (cannot invite) |

## Permission matrix

`Manage` = create/update/delete/assign roles. `Contribute` = create/update own
content. `View` = read only. Cells are the **minimum** role required; higher
roles inherit.

| Resource | Manage | Contribute | View |
|---|---|---|---|
| School settings/branding | school_admin | — | school_admin |
| School members (invite/remove/role) | school_admin | — | school_admin |
| Clubs (create/archive) | school_admin | — | all members |
| Club membership/roles | school_admin, club leader | — | club members |
| Announcements | school_admin, club leader | club leader | club members |
| Assignments | school_admin, club leader | — | club members |
| Submissions (grade) | school_admin, club leader | student (own submission only) | school_admin/club leader (all), student (own) |
| Materials | school_admin, club leader | all club members | club members |
| Project spaces / boards / cards | school_admin, club leader | all club members | club members |
| Channels (create/archive) | school_admin, club leader | — | club members |
| Messages | author (edit/delete own) | all club members | club members |
| Wiki pages | school_admin, club leader | all club members | club members |
| Events | school_admin, club leader | — | all school members |
| Profiles | self | self | all school members (public fields) |
| Achievements (award) | school_admin, club leader | — | all |
| Audit log | school_admin | — | school_admin |
| Billing | school_admin | — | school_admin |
| Platform admin console | platform_owner | — | platform_owner |

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
3. **Client (UI).** Components hide/disable actions the user can't perform,
   purely for UX — never trusted as the actual gate. Every "why is this
   button greyed out" is backed by a server check, and the reverse (button
   hidden, but action still blocked server-side if somehow triggered) always
   holds.

```ts
// lib/auth/permissions.ts (shape, not final implementation)
type Action = 'manage' | 'contribute' | 'view';
type Resource = 'club' | 'assignment' | 'submission' | 'channel' | ...;

export function can(
  membership: { schoolRole: UserRole; clubRole?: ClubMemberRole },
  action: Action,
  resource: Resource,
  context?: { resourceOwnerId?: string; userId?: string }
): boolean;

export async function requireRole(minRole: UserRole): Promise<Session>; // throws AuthorizationError -> mapped to 403
```

## Ownership-scoped exceptions

Some permissions aren't purely role-based:

- A `student` can always view/edit **their own** submission, regardless of
  club role.
- A club `leader` can manage submissions only for assignments **in the club
  they lead** — leading one club never implies access to another; the
  `club_members` row is what grants it.
- A user can always edit/delete **their own** messages and wiki edits; club
  leaders can moderate (delete) anyone's.

These are expressed as additional `using`/`with check` clauses in RLS (row
ownership via `author_id = auth.uid()` OR role check), not as a separate
system.

## Impersonation (support tooling, Phase 5+)

`platform_owner` may open a read-mostly "view as" session for support
purposes. This is never a silent auth bypass: it requires an explicit
`platform_audit_logs` entry logged *before* the session starts, a visible
"Viewing as support — School X" banner in the UI for the duration, and a
time-boxed (15 min) elevated session that auto-expires.

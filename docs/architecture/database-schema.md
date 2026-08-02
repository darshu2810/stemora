# Database Schema

Postgres on Supabase. Every tenant-owned table carries `school_id` and is
protected by Row Level Security.

**The model in one line:** a school has exactly one STEM Club, so `school_id`
*is* the club boundary. There is no `clubs` table and no `club_id` — adding
either would reintroduce a concept the product does not have.

Subject areas are `project_category` values on a project, never groups students
join. A project's leader is a column on the project, never a role on an account.

## Conventions

- Primary keys: `uuid primary key default gen_random_uuid()`.
- Every table: `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()` (maintained via `moddatetime` trigger), soft-delete via `deleted_at timestamptz` where records must be recoverable (schools, users, projects) instead of hard delete.
- Foreign keys always `on delete restrict` by default; `on delete cascade` only where a child record has no independent meaning (e.g. `project_members` cascades when `projects` is deleted).
- Every tenant-owned table's first column after the PK is `school_id`, and every index on it leads with `school_id`.

## Enums

```sql
create type user_role as enum (
  'platform_owner', 'school_admin', 'student'
);

create type membership_status as enum ('invited', 'active', 'suspended', 'removed');

create type invitation_status as enum ('pending', 'accepted', 'expired', 'revoked');

create type project_category as enum (
  'robotics', 'programming', 'artificial_intelligence', 'engineering',
  'electronics', 'mathematics', 'research', 'physics', 'environmental_science'
);

create type project_status as enum ('active', 'completed');

create type task_column as enum ('backlog', 'todo', 'in_progress', 'in_review', 'done');

create type task_priority as enum ('low', 'medium', 'high');

create type competition_level as enum ('school', 'regional', 'national', 'international');

create type competition_status as enum ('upcoming', 'completed');

create type event_type as enum ('meeting', 'workshop', 'competition', 'showcase');

create type resource_type as enum ('file', 'link');

create type notification_type as enum (
  'task_assigned', 'task_completed', 'announcement',
  'event_reminder', 'competition_deadline', 'resource_uploaded'
);
```

The `notification_type` list is closed on purpose: the app only notifies about
things it can actually do. Adding a value means shipping the feature behind it.

## Platform level (no `school_id`)

### `schools`
```sql
create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,               -- subdomain: slug.stemora.com
  district text,
  logo_url text,
  -- Each school runs exactly one STEM Club. Its name is a property of the
  -- school, not a row in a clubs table.
  club_name text not null default 'STEM Club',
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### `platform_audit_logs`
```sql
create table platform_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id),
  action text not null,                    -- e.g. 'school.created', 'support.impersonation_started'
  target_school_id uuid references schools(id),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index platform_audit_logs_created_idx on platform_audit_logs (created_at desc);
```

## Identity

### `users`
```sql
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  full_name text not null,
  avatar_url text,
  platform_role text not null default 'member' check (platform_role in ('member','platform_owner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### `school_members`
The only membership table. A row here means "this person is in this school's
STEM Club", with `role` deciding whether they run it or are in it.

```sql
create table school_members (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role user_role not null default 'student',
  grade smallint check (grade between 8 and 12),   -- students only
  status membership_status not null default 'active',
  joined_at timestamptz not null default now(),
  unique (school_id, user_id)
);
create index school_members_school_idx on school_members (school_id, role, status);
create index school_members_user_idx on school_members (user_id);
```

### `invitations`
```sql
create table invitations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  email citext not null,
  role user_role not null default 'student',
  grade smallint check (grade between 8 and 12),
  token text not null unique,
  status invitation_status not null default 'pending',
  invited_by uuid not null references users(id),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index invitations_school_idx on invitations (school_id, status);
```

## Projects

### `projects`
```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  description text not null,
  category project_category not null,
  status project_status not null default 'active',
  started_at date not null,
  due_date date not null,
  -- Project leader: a student on this project's team. Grants nothing at the
  -- account level; see docs/architecture/rbac.md.
  leader_id uuid not null references users(id),
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index projects_school_idx on projects (school_id, status, due_date);
create index projects_category_idx on projects (school_id, category);
```

### `project_members`
```sql
create table project_members (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  added_at timestamptz not null default now(),
  unique (project_id, user_id)
);
create index project_members_project_idx on project_members (school_id, project_id);
create index project_members_user_idx on project_members (user_id);
```

A task can only be assigned to someone with a row here — enforced by the
`project_tasks` RLS `with check` clause, not just by the UI.

### `project_tasks`
```sql
create table project_tasks (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  assignee_id uuid references users(id),
  column_id task_column not null default 'backlog',
  priority task_priority not null default 'medium',
  position int not null default 0,          -- order within a column
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index project_tasks_board_idx on project_tasks (school_id, project_id, column_id, position);
create index project_tasks_assignee_idx on project_tasks (school_id, assignee_id, column_id);
```

Project progress is `count(done) / count(*)` over this table. It is never a
stored column, so a progress bar cannot disagree with the board behind it.

## Competitions

```sql
create table competitions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  category project_category not null,
  level competition_level not null,
  event_date date not null,
  status competition_status not null default 'upcoming',
  result text,                              -- free text, e.g. '1st place'
  podium boolean not null default false,    -- explicit, never parsed out of `result`
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index competitions_school_idx on competitions (school_id, status, event_date desc);

create table competition_participants (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  competition_id uuid not null references competitions(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  unique (competition_id, user_id)
);
create index competition_participants_idx on competition_participants (school_id, competition_id);
```

## Events

Every event belongs to the STEM Club, so everyone in it is invited. There is no
audience column because there is no narrower audience.

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  title text not null,
  type event_type not null,
  event_date date not null,
  start_time time not null,
  location text not null,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_school_idx on events (school_id, event_date);

create table event_rsvps (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  unique (event_id, user_id)
);
```

Attendance is `count(event_rsvps)` over `count(active students)` — both derived.

## Resources

```sql
create table resources (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  title text not null,
  category project_category,                -- null = general club resource
  type resource_type not null,
  url text,                                 -- link resources
  storage_path text,                        -- file resources (Supabase Storage)
  size_bytes bigint,
  uploaded_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  check ((type = 'link' and url is not null) or (type = 'file' and storage_path is not null))
);
create index resources_school_idx on resources (school_id, category, created_at desc);
```

## Announcements

```sql
create table announcements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  author_id uuid not null references users(id),
  title text not null,
  body text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index announcements_school_idx on announcements (school_id, pinned desc, created_at desc);
```

## Achievements & profiles

```sql
create table badges (
  id text primary key,                      -- 'robotics_finalist', 'science_fair', ...
  name text not null,
  description text not null
);

create table student_achievements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  badge_id text not null references badges(id),
  note text,
  awarded_by uuid not null references users(id),
  earned_at date not null,
  unique (school_id, user_id, badge_id)
);
create index student_achievements_user_idx on student_achievements (school_id, user_id);

create table student_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  school_id uuid not null references schools(id) on delete cascade,
  headline text,
  about text,
  location text,
  updated_at timestamptz not null default now()
);

create table student_skills (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  category text not null,
  level smallint not null check (level between 1 and 5),
  unique (user_id, name)
);

create table student_certificates (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  issuer text not null,
  issued_on date not null
);
```

## Cross-cutting

```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text not null,
  link_path text,                           -- in-app destination
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on notifications (school_id, user_id, read_at, created_at desc);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  actor_id uuid references users(id),
  action text not null,                     -- e.g. 'project.created', 'student.removed'
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index audit_logs_school_idx on audit_logs (school_id, created_at desc);
```

## Row Level Security strategy

Two helpers do the work; every policy is a composition of them.

```sql
-- Is the caller a member of this school's STEM Club at all?
create or replace function is_school_member(target_school uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from school_members m
    where m.school_id = target_school
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

-- Does the caller hold at least `min_role` in this school?
create or replace function has_school_role(target_school uuid, min_role user_role)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from school_members m
    where m.school_id = target_school
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = any (
        case min_role
          when 'school_admin' then array['school_admin']::user_role[]
          when 'student'      then array['school_admin','student']::user_role[]
          else array[]::user_role[]
        end
      )
  );
$$;
```

Applied uniformly — read for any member of the club, write for the School Admin:

```sql
alter table projects enable row level security;

create policy projects_select on projects for select
  using (is_school_member(school_id));

create policy projects_write on projects for all
  using (has_school_role(school_id, 'school_admin'))
  with check (has_school_role(school_id, 'school_admin'));
```

The one ownership-scoped exception, so a student can move their own task
without being able to create or delete tasks:

```sql
create policy project_tasks_move_own on project_tasks for update
  using (is_school_member(school_id) and assignee_id = auth.uid())
  with check (assignee_id = auth.uid());
```

`platform_owner` is deliberately **not** in `has_school_role`. STEMORA staff can
read `schools` and `platform_audit_logs`; they cannot read inside a school's
club without an audited impersonation session (see
[rbac.md](rbac.md#impersonation-support-tooling-post-pilot)).

## Indexing & performance notes

- Every foreign key gets an index; every list-view query pattern
  (`school_id, created_at desc`, `school_id, project_id, column_id, position`)
  gets a matching composite index up front rather than added reactively.
- Counts shown in the UI (students, active projects, competitions, upcoming
  events) are cheap indexed aggregates at this scale. If a school ever outgrows
  that, they become a materialized view refreshed on write — never a
  hand-maintained counter column, which is how counts drift out of step with
  the rows they describe.

# Database Schema

Postgres (Supabase). All tenant-owned tables carry a non-null `school_id` and are
protected by Row Level Security. Platform-level tables (schools themselves,
platform-wide config) have no `school_id` and are restricted to `platform_owner`.

This document defines the full logical model. Tables marked **[MVP]** are built in
Phase 1; others are introduced in the milestone noted. See
[milestones-and-roadmap.md](milestones-and-roadmap.md) for phase definitions.

## Conventions

- Primary keys: `uuid default gen_random_uuid()`.
- Every table: `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()` (maintained via `moddatetime` trigger), soft-delete via `deleted_at timestamptz` where records must be recoverable (schools, users, clubs, submissions, files) instead of hard delete.
- Foreign keys always `on delete restrict` by default; `on delete cascade` only where a child record has no independent meaning (e.g. `club_members` cascades when `clubs` is deleted).
- Every tenant-scoped table has a composite index starting with `school_id`.
- Enums are Postgres native `enum` types, not free-text, so RBAC and RLS can pattern-match against them cheaply.
- All tables live in the `public` schema; `auth.users` (Supabase-managed) is mirrored into `public.users` via trigger (`handle_new_user`) so we can join, index, and add app-specific columns without touching the `auth` schema.

## Enums

```sql
create type user_role as enum (
  'platform_owner', 'school_admin', 'student'
);

create type membership_status as enum ('invited', 'active', 'suspended', 'removed');

create type club_member_role as enum ('leader', 'member');

create type invitation_status as enum ('pending', 'accepted', 'expired', 'revoked');

create type assignment_status as enum ('draft', 'published', 'closed');

create type submission_status as enum ('not_submitted', 'submitted', 'late', 'graded', 'returned');

create type board_card_status as enum ('backlog', 'todo', 'in_progress', 'in_review', 'done');

create type notification_type as enum (
  'assignment_posted', 'assignment_graded', 'submission_received',
  'club_invite', 'mention', 'message', 'event_reminder', 'system'
);

create type file_owner_type as enum (
  'material', 'submission', 'wiki_page', 'message', 'user_avatar', 'school_logo', 'project'
);
```

## Platform level (no `school_id`)

### `schools` **[MVP]**
```sql
create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,               -- subdomain: slug.stemora.com
  custom_domain text unique,               -- Phase 5
  logo_url text,
  primary_color text,                      -- brand accent, premium feel per school
  plan_id uuid references subscription_plans(id),
  status text not null default 'active' check (status in ('active','suspended','archived')),
  billing_email text,
  country text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index schools_slug_idx on schools (slug) where deleted_at is null;
```

### `subscription_plans` **[Phase 5]**
```sql
create table subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,               -- Free, Standard, Premium
  stripe_price_id text,
  max_clubs int,
  max_members int,
  features jsonb not null default '{}',
  created_at timestamptz not null default now()
);
```

### `school_subscriptions` **[Phase 5]**
```sql
create table school_subscriptions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  plan_id uuid not null references subscription_plans(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null,             -- active, trialing, past_due, canceled
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);
create unique index one_active_sub_per_school on school_subscriptions (school_id) where status in ('active','trialing');
```

### `platform_audit_logs` **[MVP]**
Platform-owner actions across tenants (school suspension, impersonation, plan changes). Separate from tenant `audit_logs` below so a compromised school-admin session can never read platform-level events.
```sql
create table platform_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references users(id),
  action text not null,
  target_school_id uuid references schools(id),
  metadata jsonb not null default '{}',
  ip_address inet,
  created_at timestamptz not null default now()
);
```

## Identity **[MVP]**

### `users`
Mirror of `auth.users`, extended. Populated by an `on auth.users insert` trigger.
```sql
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  phone text,
  platform_role text not null default 'member' check (platform_role in ('member','platform_owner')),
  last_active_school_id uuid references schools(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
```
`platform_role` is separate from per-school `user_role` — a person is a
platform_owner independent of any school; everyone else's functional role is
scoped per school via `school_members.role`.

### `school_members`
The core tenancy join: a user's role *within a specific school*. A user may
belong to multiple schools (e.g., a student enrolled at two schools) but each
membership is independently scoped and RLS-isolated.
```sql
create table school_members (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role user_role not null,
  status membership_status not null default 'invited',
  grade_level text,                 -- students only
  department text,                  -- school admins only
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
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
  email text not null,
  role user_role not null,
  club_id uuid references clubs(id) on delete cascade,   -- null = school-level invite
  token text not null unique,
  status invitation_status not null default 'pending',
  invited_by uuid not null references users(id),
  expires_at timestamptz not null default (now() + interval '14 days'),
  created_at timestamptz not null default now()
);
create index invitations_school_idx on invitations (school_id, status);
```

## Clubs **[MVP]**

### `clubs`
```sql
create table clubs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  category text,                    -- Robotics, Coding, Biology, Math, ...
  cover_image_url text,
  status text not null default 'active' check (status in ('active','archived')),
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (school_id, slug)
);
create index clubs_school_idx on clubs (school_id, status);
```

### `club_members`
```sql
create table club_members (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  club_id uuid not null references clubs(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role club_member_role not null default 'member',
  status membership_status not null default 'active',
  joined_at timestamptz not null default now(),
  unique (club_id, user_id)
);
create index club_members_school_idx on club_members (school_id, club_id);
create index club_members_user_idx on club_members (user_id);
```

## Classroom domain **[MVP]**

### `announcements`
```sql
create table announcements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  club_id uuid not null references clubs(id) on delete cascade,
  author_id uuid not null references users(id),
  title text not null,
  body text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index announcements_club_idx on announcements (school_id, club_id, created_at desc);
```

### `assignments`
```sql
create table assignments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  club_id uuid not null references clubs(id) on delete cascade,
  created_by uuid not null references users(id),
  title text not null,
  instructions text,
  points_possible numeric(6,2) default 100,
  status assignment_status not null default 'draft',
  due_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index assignments_club_idx on assignments (school_id, club_id, status);
```

### `assignment_submissions`
```sql
create table assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  assignment_id uuid not null references assignments(id) on delete cascade,
  student_id uuid not null references users(id) on delete cascade,
  status submission_status not null default 'not_submitted',
  content text,                      -- text response, if any
  submitted_at timestamptz,
  score numeric(6,2),
  feedback text,
  graded_by uuid references users(id),
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);
create index submissions_assignment_idx on assignment_submissions (school_id, assignment_id);
create index submissions_student_idx on assignment_submissions (student_id);
```

### `materials`
Shared resources/files for a club (readings, slide decks, links).
```sql
create table materials (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  club_id uuid not null references clubs(id) on delete cascade,
  uploaded_by uuid not null references users(id),
  title text not null,
  description text,
  external_url text,                 -- if it's a link, not an upload
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index materials_club_idx on materials (school_id, club_id);
```

## Projects & Kanban (GitHub + Trello) **[Phase 2]**

### `project_spaces`
```sql
create table project_spaces (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  club_id uuid not null references clubs(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active','archived')),
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### `boards`, `board_columns`, `board_cards`
```sql
create table boards (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  project_space_id uuid not null references project_spaces(id) on delete cascade,
  name text not null default 'Main Board',
  created_at timestamptz not null default now()
);

create table board_columns (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  position int not null
);

create table board_cards (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  column_id uuid not null references board_columns(id) on delete cascade,
  title text not null,
  description text,
  status board_card_status not null default 'todo',
  position int not null,
  due_at timestamptz,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index board_cards_column_idx on board_cards (school_id, column_id, position);

create table card_assignees (
  card_id uuid not null references board_cards(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  primary key (card_id, user_id)
);
```

## Communication (Discord-like) **[Phase 3]**

### `channels`, `messages`
```sql
create table channels (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  club_id uuid not null references clubs(id) on delete cascade,
  name text not null,
  topic text,
  is_private boolean not null default false,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  channel_id uuid not null references channels(id) on delete cascade,
  author_id uuid not null references users(id),
  body text not null,
  edited_at timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index messages_channel_idx on messages (school_id, channel_id, created_at desc);
```

### `direct_message_threads`, `direct_messages`
```sql
create table direct_message_threads (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table direct_message_participants (
  thread_id uuid not null references direct_message_threads(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  primary key (thread_id, user_id)
);

create table direct_messages (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  thread_id uuid not null references direct_message_threads(id) on delete cascade,
  author_id uuid not null references users(id),
  body text not null,
  created_at timestamptz not null default now()
);
```

## Wiki / Docs (Notion-like) **[Phase 3]**

```sql
create table wiki_pages (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  club_id uuid not null references clubs(id) on delete cascade,
  parent_page_id uuid references wiki_pages(id) on delete cascade,
  title text not null,
  content jsonb not null default '{}',   -- rich-text document (block-editor JSON)
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index wiki_pages_club_idx on wiki_pages (school_id, club_id, parent_page_id);
```

## Events & Calendar **[Phase 2]**

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  club_id uuid references clubs(id) on delete cascade,   -- null = school-wide event
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index events_school_idx on events (school_id, starts_at);

create table event_attendees (
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  rsvp_status text not null default 'invited' check (rsvp_status in ('invited','going','not_going','maybe')),
  primary key (event_id, user_id)
);
```

## Profiles & Achievements (LinkedIn-like) **[Phase 4]**

```sql
create table user_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  headline text,
  bio text,
  skills text[] not null default '{}',
  links jsonb not null default '{}',      -- { github, linkedin, portfolio }
  is_public boolean not null default true,
  updated_at timestamptz not null default now()
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references schools(id) on delete cascade,  -- null = platform-wide badge
  name text not null,
  description text,
  icon_url text,
  created_at timestamptz not null default now()
);

create table user_achievements (
  user_id uuid not null references users(id) on delete cascade,
  achievement_id uuid not null references achievements(id) on delete cascade,
  awarded_by uuid references users(id),
  awarded_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table follows (
  follower_id uuid not null references users(id) on delete cascade,
  following_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);
```

## Cross-cutting **[MVP unless noted]**

### `notifications`
```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on notifications (user_id, read_at, created_at desc);
```

### `file_objects`
Metadata layer over Supabase Storage objects; the actual bytes live in Storage,
partitioned by school as described in [multi-tenancy.md](multi-tenancy.md#storage-isolation).
```sql
create table file_objects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  owner_type file_owner_type not null,
  owner_id uuid not null,
  storage_bucket text not null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  uploaded_by uuid not null references users(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index file_objects_owner_idx on file_objects (school_id, owner_type, owner_id);
```

### `audit_logs` (tenant-scoped, distinct from `platform_audit_logs`)
```sql
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  actor_id uuid references users(id),
  action text not null,              -- e.g. 'club.member.role_changed'
  resource_type text not null,
  resource_id uuid,
  metadata jsonb not null default '{}',
  ip_address inet,
  created_at timestamptz not null default now()
);
create index audit_logs_school_idx on audit_logs (school_id, created_at desc);
```

## Row Level Security strategy

Every tenant table gets RLS enabled with a uniform pattern built on a
`current_school_id()` helper and a `has_school_role()` helper, both `security
definer` functions reading from the JWT custom claims set at login (see
[multi-tenancy.md](multi-tenancy.md) and [authentication.md](authentication.md)):

```sql
create or replace function current_school_id() returns uuid
language sql stable security definer as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'school_id', '')::uuid
$$;

create or replace function has_school_role(min_role user_role) returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from school_members sm
    where sm.school_id = current_school_id()
      and sm.user_id = auth.uid()
      and sm.status = 'active'
      and sm.role::text = any (
        case min_role
          when 'student' then array['student','school_admin']
          when 'school_admin' then array['school_admin']
          else array[]::text[]
        end
      )
  )
$$;

-- example policy, applied identically (with per-table role thresholds) to every tenant table
alter table clubs enable row level security;

create policy clubs_select on clubs for select
  using (school_id = current_school_id());

create policy clubs_insert on clubs for insert
  with check (school_id = current_school_id() and has_school_role('school_admin'));

create policy clubs_update on clubs for update
  using (school_id = current_school_id() and has_school_role('school_admin'));

create policy clubs_delete on clubs for delete
  using (school_id = current_school_id() and has_school_role('school_admin'));
```

`platform_owner` bypasses tenant scoping entirely via a separate policy branch
(`using (exists (select 1 from users u where u.id = auth.uid() and u.platform_role = 'platform_owner'))`),
used only by the platform admin console, never by tenant-facing routes.

Full per-table policy matrix (who can select/insert/update/delete what) is
defined in [rbac.md](rbac.md#permission-matrix) and implemented 1:1 as RLS
policies — the permission matrix *is* the RLS spec, not a separate source of truth.

## Indexing & performance notes

- Every foreign key gets an index; every list-view query pattern (`club_id, created_at desc`, etc.) gets a matching composite index up front rather than added reactively.
- `school_id` is always the leading column in composite indexes on tenant tables so Postgres can use it for partition-pruning-like filtering even without physical partitioning.
- At scale (Phase 6), candidate tables for partitioning by `school_id` range or hash: `messages`, `notifications`, `audit_logs` — revisit with real volume data, not preemptively.

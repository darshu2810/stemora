# API Structure

STEMORA uses a hybrid API approach, chosen per operation type:

| Mechanism | Used for |
|---|---|
| **Server Actions** (`"use server"`, in `features/*/server/actions.ts`) | All UI-triggered mutations from Server/Client Components. Primary mutation path. |
| **Route Handlers** (`app/api/v1/**`) | Anything needing a stable HTTP contract: third-party integrations, mobile clients (future), public-ish endpoints. |
| **Supabase Edge Functions** (`supabase/functions/**`) | Work that must run with the service role, independent of a user request: transactional email (invitations, event reminders) via Resend, scheduled jobs, background exports. |
| **Supabase Realtime** | Live features only: notification badges and kanban card moves. Client subscribes directly (via the anon key + RLS — never service role), no polling. |

Business logic is never duplicated across these — Route Handlers and Server
Actions both call the same `features/*/server/*` functions; Edge Functions
call into a small shared package (or duplicate minimal glue) only where they
must run outside the Next.js runtime.

## Route Handler conventions

```
app/api/v1/
├── schools/route.ts                       GET (platform_owner: list), POST (create, marketing signup)
├── schools/[schoolId]/route.ts            GET, PATCH, DELETE (soft)
├── students/route.ts                      GET (the club roster), POST (invite)
├── students/[studentId]/route.ts          GET, PATCH, DELETE
├── projects/route.ts                      GET (scoped, filterable by category/status), POST
├── projects/[projectId]/route.ts          GET, PATCH, DELETE
├── projects/[projectId]/tasks/route.ts    GET, POST
├── tasks/[taskId]/route.ts                PATCH (move/reassign), DELETE
├── competitions/route.ts                  GET, POST
├── events/route.ts                        GET, POST
├── resources/route.ts                     GET, POST
├── announcements/route.ts                 GET, POST
├── webhooks/resend/route.ts               POST (delivery/bounce events)
└── search/route.ts                        GET
```

- **Versioned from day one** (`/api/v1/...`) even though there's only one
  consumer today (our own frontend) — avoids a breaking migration the moment
  a mobile app or public API is scoped.
- **Response envelope**, consistent across every endpoint:

```ts
// success
{ data: T, meta?: { page, pageSize, total } }
// error
{ error: { code: string, message: string, fields?: Record<string, string[]> } }
```

- **Every handler**, in order: (1) parse & validate input with zod
  (`lib/validation`), (2) resolve session + tenant (`lib/auth/session.ts`),
  (3) authorization check (`requireRole`/`can()`), (4) call the feature's
  server function, (5) return the envelope. Steps 1–3 are wrapped in a shared
  `withApiHandler()` higher-order function so no handler can skip them by
  accident.
- **Pagination**: cursor-based (`?cursor=&limit=`) for feeds that grow
  unbounded (notifications, audit logs); offset-based
  (`?page=&pageSize=`) acceptable for bounded lists (the student roster, the resource library).
- **Idempotency**: any webhook consumer dedupes on the provider's event ID
  before processing.

## Rate limiting

Applied in `middleware.ts` (edge) using a token-bucket backed by Upstash
Redis (or Vercel's built-in if sufficient at MVP scale):

- Auth endpoints (`/login`, `/forgot-password`, `/invite/*` acceptance): strict, per-IP + per-email.
- General authenticated API: per-user, generous (e.g. 300 req/min) — generous enough to never be felt in normal use, tight enough to blunt scripted abuse.
- Webhooks: not rate-limited by us; signature verification is the gate instead.

## Authorization inside the API layer

Every Route Handler and Server Action calls `requireRole()`/`can()` from
[rbac.md](rbac.md#enforcement-layers) before any database access — this is
belt-and-suspenders on top of RLS, not a replacement for it. If a handler
somehow skipped this step, RLS is still the backstop that prevents a
cross-tenant or under-privileged read/write from succeeding.

## Error handling & observability

- All thrown errors normalized to the response envelope's `error` shape;
  unexpected exceptions are logged to Sentry with request context (school_id,
  user_id, route) scrubbed of PII beyond IDs.
- Every mutation that changes tenant state also writes an `audit_logs` row in
  the same transaction (or immediately after, best-effort with a retry queue
  for non-critical ones) — see [database-schema.md](database-schema.md#cross-cutting-mvp-unless-noted).

## Supabase Edge Functions (initial set)

| Function | Trigger | Purpose |
|---|---|---|
| `send-invitation-email` | invoked from Server Action after `invitations` insert | Resend transactional email |
| `event-reminders` | scheduled (cron) | Remind the club the day before a meeting, workshop, or competition |
| `export-school-data` | invoked, long-running | Generate GDPR/FERPA export archive |
| `purge-deleted-school` | scheduled (cron) | Hard-delete schools past the 30-day soft-delete grace period |

## Client data fetching

React Query wraps all client-side reads (`features/*/hooks/use-*.ts`),
seeded with the Server Component's initial data via `initialData` /
`HydrationBoundary` — no client-side waterfall on first paint. Mutations go
through Server Actions and invalidate the relevant React Query keys on
success; optimistic updates are used for latency-sensitive interactions
(kanban card drag, message send, notification read).

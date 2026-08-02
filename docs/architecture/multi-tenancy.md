# Multi-Tenancy

Every school is a tenant with fully isolated data. No school can ever read or
write another school's rows, files, or metadata — enforced at the database
layer, not merely the application layer.

## Tenant resolution

**Default: subdomain-based** — `riverside.stemora.com`, `oakridge.stemora.com`.

Rationale: matches the premium-SaaS comparables named in `stemora.md`
(Notion, Linear, Slack all use subdomains or workspace-scoped URLs), gives
each school a distinct, brandable address, and keeps route params free of
`schoolSlug` clutter. Custom domains (`stem.riversidehs.edu` → CNAME to
Vercel) are a Phase 5 add-on layered on top of the same resolution mechanism,
not a different one.

```
src/middleware.ts
  1. Read Host header.
  2. If host === stemora.com or www.stemora.com -> (marketing)/(auth) group, no tenant.
  3. If host === admin.stemora.com -> (platform-admin) group, requires platform_owner.
  4. Else parse subdomain (or resolve schools.custom_domain) -> lookup schools by slug/domain
     (cached in an edge KV / in-memory LRU with short TTL, since this runs on every request).
  5. If school not found -> 404.
  6. If school.status != 'active' -> /school-suspended.
  7. Attach resolved school_id to request (via a signed header or AsyncLocalStorage-equivalent
     for RSC) for the rest of the request lifecycle.
```

Local development fallback: `localhost:3000/[schoolSlug]/...` path-based
routing (via a dev-only rewrite in `next.config.ts`), since `*.localhost`
subdomain wildcards are unreliable across OSes. This is a dev convenience
only — production is always subdomain-based, and code should resolve the
tenant through one function (`resolveSchool()`) so the two modes are
invisible to everything downstream.

## The isolation guarantee, layer by layer

1. **Row Level Security (primary boundary).** Every tenant table's policies
   filter on `school_id = current_school_id()`, where `current_school_id()`
   reads a custom JWT claim, not a client-supplied value (see
   [authentication.md](authentication.md#flow-login--tenant--role-resolution)).
   A compromised or buggy application layer still cannot cross tenants,
   because Postgres itself enforces it per-row.
2. **JWT claims, not request params.** `school_id` for RLS purposes never
   comes from a URL param, request body, or header set by the client — only
   from the signed JWT, populated server-side by the custom access token
   hook at sign-in/refresh/school-switch. A malicious client editing
   `clubId` in a request cannot make the database believe it belongs to a
   different school.
3. **Server-side query scoping (defense in depth, not the boundary).** Every
   `features/*/server/queries.ts` / `actions.ts` function still explicitly
   filters by `school_id` pulled from the resolved session — belt-and-suspenders
   so a missing RLS policy on a new table fails closed in application logic
   too, and so query plans benefit from the index even before RLS filters.
4. **Storage isolation.** See below.
5. **Background jobs / Edge Functions.** Any function operating across
   schools (digest emails, Stripe webhook processing) uses the Supabase
   service role key deliberately and loops per-school explicitly — it must
   never share a single unscoped query across tenants.

## Storage isolation

Supabase Storage buckets are organized with `school_id` as the leading path
segment, and storage policies mirror the RLS pattern:

```
{bucket}/{school_id}/{owner_type}/{owner_id}/{filename}
```

Buckets: `avatars` (public read, school-scoped write), `materials`,
`submissions`, `wiki-attachments`, `logos` (public read). Storage RLS
policies check `storage.foldername(name)[1] = current_school_id()::text` plus
the same role checks as the corresponding `file_objects` row.

## Cross-tenant surfaces (the only intentional exceptions)

- **Platform admin console** (`admin.stemora.com`): `platform_owner` only,
  reads across all schools via a separate policy branch that checks
  `users.platform_role = 'platform_owner'` instead of `school_id` matching.
  Every read here is still logged to `platform_audit_logs`.
- **Marketing/signup** (`stemora.com`): no tenant context; creates a new
  tenant.
- Nothing else. A user who is `school_admin` at School A has **zero**
  visibility into School B even if they're later invited there — each
  `school_members` row is independently scoped, and the JWT only ever
  carries one active `school_id` at a time.

## School switching

A user belonging to multiple schools (e.g. a student enrolled at two)
switches via the topbar school switcher, which updates
`users.last_active_school_id` and forces a token refresh so the JWT's
`school_id` claim changes. The two memberships never mix within a single
request/session context.

## Data lifecycle & compliance

- School deletion (school_admin-initiated, or platform_owner-enforced for
  non-payment) is a soft delete (`schools.deleted_at`) with a 30-day grace
  period before a scheduled hard-delete job (Edge Function, cron) purges rows
  and storage objects — irreversible action gated behind explicit
  confirmation UI (type-the-school-name pattern) and a platform-level
  approval step for anything platform_owner-initiated.
- Data export (GDPR/FERPA-style "give me my data"): a per-school export job
  producing a downloadable archive, scoped by the same `school_id` filters as
  everything else.
- Because this platform serves K-12 students, FERPA/COPPA-aware handling is
  a first-class constraint, not an afterthought: minimal PII collection for
  student accounts, parental-consent flag for under-13 students (Phase 2+,
  needs product/legal input on exact flow), and `audit_logs` retention
  sufficient for compliance review.

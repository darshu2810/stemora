# Component Library

Design system built on shadcn/ui primitives + Tailwind, extended with a
composed "shared" layer used across every feature. Visual bar: Linear,
Notion, Stripe, Apple, GitHub, Framer, Vercel — restrained color, generous
whitespace, consistent 8px-based spacing scale, consistent radius (`--radius`
token, one value used everywhere, no per-component overrides), subtle
Framer Motion transitions (150–250ms, ease-out) on state changes, never
decorative animation.

## Layer structure

- `components/ui/*` — shadcn primitives (Button, Input, Select, Dialog,
  Dropdown, Popover, Tabs, Tooltip, Toast, Sheet, Checkbox, RadioGroup,
  Switch, Textarea, Command). Generated via the shadcn CLI, customized only
  for the shared token set (colors, radius, font) — not per-instance.
- `components/shared/*` — composed, domain-agnostic components every feature
  reuses:

| Component | Notes |
|---|---|
| `DataTable` | Searchable, paginated; column defs typed generically; used for the student roster and the resource library. |
| `Sidebar` | Collapsible, role-aware nav (reads `config/navigation.ts`), active-state highlighting. |
| `Navbar` / `Topbar` | Theme toggle, notification bell, persona menu. |
| `CategoryFilter` | One filter over project categories, shared by Projects, Resources, and Competitions. Categories describe work, never groups students join. |
| `Card` | Base surface used everywhere (project card, event card, announcement card). |
| `StatCard` | Metric + optional delta, used on dashboards. Every value it renders is derived from the data it describes. |
| `Dialog` / `ConfirmDialog` | `ConfirmDialog` standardizes every destructive-action confirmation (type-to-confirm variant for irreversible actions like school deletion). |
| `FormField` wrappers | React Hook Form + zod resolver bindings around `ui/*` inputs, with consistent label/error/description layout. |
| `Dropdown` / `ActionMenu` | Row-level and page-level "..." menus. |
| `Badge` / `StatusBadge` | Semantic color mapping (draft/gray, published/blue, closed/neutral, overdue/red, graded/green) — one mapping table, reused everywhere status appears. |
| `Pagination` | Cursor and offset variants sharing one visual component. |
| `FileUpload` | Drag-drop + progress, wraps Supabase Storage resumable upload, emits `file_objects` row on completion. |
| `NotificationBell` / `NotificationList` | Realtime-subscribed unread count + dropdown. |
| `Avatar` | With graceful initials fallback. |
| `KanbanBoard` | Drag-and-drop columns/cards (dnd-kit), optimistic reordering. |
| `EmptyState` | Icon + message + primary action, one component instance for every empty list in the product (never a bespoke one-off per page). |
| `PageHeader` | Title + breadcrumb + primary actions, consistent across every top-level page. |
| `Skeleton` variants | Table skeleton, card-grid skeleton, detail-page skeleton — matched to their real layout so loading states don't "jump." |

- Feature-specific components (e.g. `ProjectBoardClient`,
  `AnnouncementsView`, `CompetitionsView`) live inside their owning
  `features/*/components/` folder and compose the shared layer above — they
  are never duplicated into `components/shared` even if a similar shape
  appears in two features; genuine convergence gets promoted deliberately,
  not by default.

## Required states per interactive view (per `stemora.md` general rules)

Every list/detail view implements, using the shared primitives above:

- **Loading** — matched `Skeleton` variant, never a bare spinner for
  content-shaped views.
- **Empty** — `EmptyState`, always explaining itself rather than showing a
  bare table. Role-appropriate copy from the same component: "No projects have
  been created yet" for a School Admin, "You're not on a project yet — ask your
  School Admin to add you to a project team" for a Student.
- **Error** — inline retry affordance for fetch failures; `error.tsx`
  boundary per route group for unhandled errors.
- **Success** — `Toast` confirmation for mutations, optimistic UI where
  latency-sensitive.
- Permission-gated actions render via `can()` (see
  [rbac.md](rbac.md#enforcement-layers)) so a disabled/hidden control and the
  server's actual enforcement never diverge in practice, even though the
  client check alone is never trusted.

## Theming & tokens

- Design tokens (color scale, spacing scale, radius, shadow scale, font
  stack) defined once in `tailwind.config.ts` / CSS variables in
  `styles/globals.css`; per-school branding (`schools.primary_color`,
  `logo_url`) overrides a small, explicit set of CSS variables at the
  tenant-root layout level — never a full re-theme, keeping the product
  visually consistent across schools while still feeling "theirs."
- Dark mode supported from the start via CSS variables + `prefers-color-scheme`,
  not retrofitted later.

## Accessibility

shadcn/Radix primitives give correct focus management, keyboard nav, and ARIA
out of the box; the discipline required from us is: every icon-only button
has an `aria-label`, every form field has a programmatically associated
label/error, color is never the sole status signal (icon + text pairs with
every `StatusBadge`), and interactive targets meet the 44px touch minimum on
mobile layouts.

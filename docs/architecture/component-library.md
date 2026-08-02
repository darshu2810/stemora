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
| `DataTable` | Sortable, filterable, paginated; column defs typed generically; used for member lists, admin school lists, grading queues. |
| `Sidebar` | Collapsible, role-aware nav (reads `config/navigation.ts`), active-state highlighting. |
| `Navbar` / `Topbar` | School switcher, global search trigger, notification bell, avatar menu. |
| `SearchBar` | Debounced, keyboard-navigable, used standalone and inside `Command` palette. |
| `Filters` | Composable filter chips + panel (role, category, status, date range) driving URL search params. |
| `Charts` | Recharts wrappers: `LineChart`, `BarChart`, `DonutChart` pre-themed, used in dashboards/analytics. |
| `Card` | Base surface used everywhere (club card, project card, event card). |
| `StatCard` | Metric + delta + sparkline, used on dashboards. |
| `Dialog` / `ConfirmDialog` | `ConfirmDialog` standardizes every destructive-action confirmation (type-to-confirm variant for irreversible actions like school deletion). |
| `FormField` wrappers | React Hook Form + zod resolver bindings around `ui/*` inputs, with consistent label/error/description layout. |
| `Dropdown` / `ActionMenu` | Row-level and page-level "..." menus. |
| `Badge` / `StatusBadge` | Semantic color mapping (draft/gray, published/blue, closed/neutral, overdue/red, graded/green) — one mapping table, reused everywhere status appears. |
| `Pagination` | Cursor and offset variants sharing one visual component. |
| `FileUpload` | Drag-drop + progress, wraps Supabase Storage resumable upload, emits `file_objects` row on completion. |
| `NotificationBell` / `NotificationList` | Realtime-subscribed unread count + dropdown. |
| `Calendar` | Month/week/agenda views, used by `/calendar` and club events. |
| `Avatar` | With graceful initials fallback, presence-dot variant for chat. |
| `KanbanBoard` | Drag-and-drop columns/cards (dnd-kit), optimistic reordering. |
| `EmptyState` | Icon + message + primary action, one component instance for every empty list in the product (never a bespoke one-off per page). |
| `PageHeader` | Title + breadcrumb + primary actions, consistent across every top-level page. |
| `Skeleton` variants | Table skeleton, card-grid skeleton, detail-page skeleton — matched to their real layout so loading states don't "jump." |

- Feature-specific components (e.g. `AssignmentSubmitForm`,
  `ClubMemberInviteDialog`, `ChannelMessageComposer`) live inside their owning
  `features/*/components/` folder and compose the shared layer above — they
  are never duplicated into `components/shared` even if a similar shape
  appears in two features; genuine convergence gets promoted deliberately,
  not by default.

## Required states per interactive view (per `stemora.md` general rules)

Every list/detail view implements, using the shared primitives above:

- **Loading** — matched `Skeleton` variant, never a bare spinner for
  content-shaped views.
- **Empty** — `EmptyState` with a role-appropriate primary action ("Create
  your first club" for a school admin, "No clubs yet — ask your school admin" copy
  variant for a student, same component, different props).
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

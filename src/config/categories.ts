import type {
  CompetitionLevel,
  EventType,
  ProjectCategory,
} from "@/lib/supabase/types";

/**
 * The subject areas a project, competition, or resource can be tagged with.
 * These are metadata describing the work — not groups a student belongs to.
 * They mirror the `project_category` enum in Postgres; adding one here without
 * a migration will be rejected by the database.
 */
export const PROJECT_CATEGORIES: readonly ProjectCategory[] = [
  "Robotics",
  "Programming",
  "Artificial Intelligence",
  "Engineering",
  "Electronics",
  "Mathematics",
  "Research",
  "Physics",
  "Environmental Science",
];

export const COMPETITION_LEVELS: readonly CompetitionLevel[] = [
  "School",
  "Regional",
  "National",
  "International",
];

export const EVENT_TYPES: readonly EventType[] = [
  "Meeting",
  "Workshop",
  "Competition",
  "Showcase",
];

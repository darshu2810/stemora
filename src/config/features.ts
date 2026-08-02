// Single source of truth for what ships in the MVP.
//
// STEMORA v1 is scoped to STEM club management for a single piloting school.
// Everything built beyond that scope (the global ecosystem, the platform
// console, messaging, the follow system) is kept in the repo but parked —
// its route files live under src/future-modules/routes/ so Next.js never
// registers them, and every nav entry for it is gated behind a flag here.
//
// To bring a module back: flip its flag to true, move the matching folder out
// of src/future-modules/routes/ and back into src/app/, and restore its nav
// entry from FUTURE_NAV in src/config/navigation.ts. See
// src/future-modules/README.md for the per-module checklist.

export type FeatureModule =
  // Public / marketing
  | "pricing"
  // Platform (super admin) console
  | "platformConsole"
  | "billing"
  // Global STEM ecosystem
  | "discover"
  | "globalFeed"
  | "globalSearch"
  | "schoolDirectory"
  | "projectShowcase"
  | "studentDirectory"
  | "researchHub"
  | "globalCompetitions"
  | "eventsDirectory"
  | "forums"
  | "publicPortfolio"
  | "follows"
  // School / student surfaces beyond the MVP nav
  | "clubs"
  | "schoolTasks"
  | "schoolCalendar"
  | "messaging"
  | "leaderboard"
  | "notificationsPage"
  | "studentSettings";

export const FEATURES: Record<FeatureModule, boolean> = {
  pricing: false,

  platformConsole: false,
  billing: false,

  discover: false,
  globalFeed: false,
  globalSearch: false,
  schoolDirectory: false,
  projectShowcase: false,
  studentDirectory: false,
  researchHub: false,
  globalCompetitions: false,
  eventsDirectory: false,
  forums: false,
  publicPortfolio: false,
  follows: false,

  clubs: false,
  schoolTasks: false,
  schoolCalendar: false,
  messaging: false,
  leaderboard: false,
  notificationsPage: false,
  studentSettings: false,
};

export function isEnabled(feature: FeatureModule): boolean {
  return FEATURES[feature];
}

// Nav helper: keeps parked entries visible in source (so nobody has to
// rediscover the route) while filtering them out of the rendered menu.
export type Gated<T> = T & { feature?: FeatureModule };

export function enabledOnly<T>(items: Gated<T>[]): T[] {
  return items
    .filter((item) => item.feature === undefined || isEnabled(item.feature))
    .map((item) => {
      const rest = { ...item };
      delete rest.feature;
      return rest as T;
    });
}

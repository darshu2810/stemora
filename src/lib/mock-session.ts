"use client";

import * as React from "react";
import type { UserRole } from "@/config/roles";
import { mockUsers, type MockUser } from "@/lib/mock-data";

const STORAGE_KEY = "stemora_mock_role";
const DEFAULT_ROLE: UserRole = "school_admin";

// There is no backend yet (see docs/architecture/authentication.md for the
// real flow this stands in for). This is a client-only stand-in so every
// dashboard shell can be previewed and switched between without a login
// system — swapped for a real Supabase session once auth is built.
export function getStoredRole(): UserRole {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  return (window.localStorage.getItem(STORAGE_KEY) as UserRole | null) ?? DEFAULT_ROLE;
}

export function setStoredRole(role: UserRole) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, role);
  window.dispatchEvent(new Event("mock-session-change"));
}

function subscribe(callback: () => void) {
  window.addEventListener("mock-session-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("mock-session-change", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useMockSession(): { role: UserRole; user: MockUser; setRole: (r: UserRole) => void } {
  const role = React.useSyncExternalStore(subscribe, getStoredRole, () => DEFAULT_ROLE);

  const setRole = React.useCallback((r: UserRole) => {
    setStoredRole(r);
  }, []);

  return { role, user: mockUsers[role], setRole };
}

"use client";

import * as React from "react";

const STORAGE_KEY = "stemora_follows";
const EMPTY: string[] = [];

// useSyncExternalStore compares snapshots by reference, so parsing the raw
// JSON on every call would return a new array each time and loop forever.
// Cache the parsed value and only re-parse when the raw string actually changes.
let cachedRaw: string | null = null;
let cachedValue: string[] = EMPTY;

function readFollows(): string[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  try {
    cachedValue = raw ? (JSON.parse(raw) as string[]) : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }
  return cachedValue;
}

function writeFollows(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("stemora-follows-change"));
}

function subscribe(callback: () => void) {
  window.addEventListener("stemora-follows-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("stemora-follows-change", callback);
    window.removeEventListener("storage", callback);
  };
}

// Client-only follow state, persisted to localStorage — stands in for a real
// `follows` table until the backend exists. `id` is a namespaced string like
// "school:gs1" or "student:gstu0" so every entity type shares one store.
export function useFollows() {
  const list = React.useSyncExternalStore(subscribe, readFollows, () => EMPTY);
  const follows = React.useMemo(() => new Set(list), [list]);

  const isFollowing = React.useCallback((id: string) => follows.has(id), [follows]);

  const toggleFollow = React.useCallback((id: string) => {
    const current = new Set(readFollows());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    writeFollows(Array.from(current));
  }, []);

  return { isFollowing, toggleFollow, followCount: follows.size };
}

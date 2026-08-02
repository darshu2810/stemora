"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockClubs } from "@/lib/mock-data";

export const ALL_CLUBS = "all";

// Base UI renders the raw value in the trigger unless the root is given an
// `items` map, which is why an unlabelled filter reads "all". Building the map
// from the same source as the options keeps the two from drifting.
const CLUB_LABELS: Record<string, string> = {
  [ALL_CLUBS]: "All clubs",
  ...Object.fromEntries(mockClubs.map((c) => [c.id, c.name])),
};

/**
 * Club filter used across every school and student list view. Value is a club
 * id, or ALL_CLUBS.
 */
export function ClubFilter({
  value,
  onChange,
  className = "w-44",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Select items={CLUB_LABELS} value={value} onValueChange={(v) => onChange(v ?? ALL_CLUBS)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Club" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_CLUBS}>All clubs</SelectItem>
        {mockClubs.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

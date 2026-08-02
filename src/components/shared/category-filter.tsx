"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ALL_CATEGORIES = "all";

/**
 * Filters a list by project category. Categories are a property of the work,
 * not a group students belong to — the STEM Club is the only group there is.
 *
 * Base UI renders the raw value in the trigger unless the root is given an
 * `items` map, which is why an unlabelled filter would otherwise read "all".
 */
export function CategoryFilter({
  value,
  onChange,
  categories,
  allLabel = "All categories",
  className = "w-52",
}: {
  value: string;
  onChange: (value: string) => void;
  categories: readonly string[];
  allLabel?: string;
  className?: string;
}) {
  const labels: Record<string, string> = {
    [ALL_CATEGORIES]: allLabel,
    ...Object.fromEntries(categories.map((c) => [c, c])),
  };

  return (
    <Select items={labels} value={value} onValueChange={(v) => onChange(v ?? ALL_CATEGORIES)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={allLabel} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_CATEGORIES}>{allLabel}</SelectItem>
        {categories.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

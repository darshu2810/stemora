import Link from "next/link";
import { Users2, MapPin } from "lucide-react";
import type { GlobalSchool } from "@/lib/mock-global";

export function SchoolCard({ school }: { school: GlobalSchool }) {
  return (
    <Link
      href={`/schools/${school.slug}`}
      className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40"
    >
      <div className={`h-16 bg-gradient-to-br ${school.cover}`} />
      <div className="p-4">
        <h3 className="font-display text-sm font-semibold">{school.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" /> {school.city}, {school.country}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {school.categories.slice(0, 2).map((c) => (
            <span key={c} className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-medium text-secondary-foreground">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1 font-mono text-[0.65rem] text-muted-foreground">
          <Users2 className="size-3" /> {school.stats.students.toLocaleString()} students · {school.stats.projects} projects
        </p>
      </div>
    </Link>
  );
}

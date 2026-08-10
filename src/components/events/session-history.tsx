import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { SessionSummary } from "@/lib/db/queries";

/**
 * Attendance across every session the club has held. A session nobody has
 * marked yet says so rather than reporting zero present, which would read as
 * "nobody came".
 */
export function SessionHistory({ sessions }: { sessions: SessionSummary[] }) {
  if (sessions.length === 0) return null;

  return (
    <section>
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
        <ClipboardCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
        Attendance history
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Every session so far. Open one to take or change its attendance.
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <div className="divide-y divide-border">
          {sessions.map((s) => (
            <Link
              key={s.id}
              href={`/school/events/${s.id}`}
              className="flex flex-wrap items-center gap-3 p-3.5 transition-colors hover:bg-accent/50"
            >
              <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wider text-primary">
                Session {s.sessionNumber}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {s.topic || `Session ${s.sessionNumber}`}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(s.date)}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {s.marked === 0
                  ? "not taken yet"
                  : `${s.present}/${s.totalStudents} present`}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

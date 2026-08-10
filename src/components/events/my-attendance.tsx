import { ClipboardCheck } from "lucide-react";
import { StatusBadge, type StatusKind } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { ATTENDANCE_LABELS, countsAsPresent } from "@/lib/events";
import type { OwnAttendance } from "@/lib/db/queries";
import type { AttendanceStatus } from "@/lib/supabase/types";

const BADGE: Record<AttendanceStatus, StatusKind> = {
  present: "active",
  late: "pending",
  excused: "pending",
  absent: "suspended",
};

/**
 * A student's own attendance and nothing else. Only their own records are
 * fetched, so no one can read the register for the rest of the club.
 */
export function MyAttendance({ records }: { records: OwnAttendance[] }) {
  if (records.length === 0) return null;

  const attended = records.filter((r) => countsAsPresent(r.status)).length;
  const taken = records.filter((r) => r.status !== null).length;

  return (
    <section>
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
        <ClipboardCheck className="size-4 text-muted-foreground" strokeWidth={1.75} />
        My attendance
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {taken === 0
          ? "Nothing has been marked yet."
          : `You've been at ${attended} of the ${taken} sessions marked so far.`}
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <div className="divide-y divide-border">
          {records.map((r) => (
            <div key={r.eventId} className="flex flex-wrap items-center gap-3 p-3.5">
              <span className="inline-flex shrink-0 items-center rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wider text-secondary-foreground">
                Session {r.sessionNumber}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {r.topic || `Session ${r.sessionNumber}`}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(r.date)}</p>
              </div>
              {r.status ? (
                <StatusBadge status={BADGE[r.status]} label={ATTENDANCE_LABELS[r.status]} />
              ) : (
                <span className="font-mono text-xs text-muted-foreground">not taken</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

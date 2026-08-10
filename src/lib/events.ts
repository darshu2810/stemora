import type { AttendanceStatus, EventType } from "@/lib/supabase/types";

/**
 * Every event type a club can schedule. `Session` is first because it is the
 * one that means "the club actually met", and the only one that keeps
 * attendance.
 */
export const EVENT_TYPES: EventType[] = [
  "Session",
  "Meeting",
  "Workshop",
  "Competition",
  "Showcase",
  "Guest Speaker",
  "Field Trip",
  "Social",
  "Other",
];

/** Attendance is kept for sessions and nothing else. */
export function keepsAttendance(type: EventType): boolean {
  return type === "Session";
}

/**
 * How a session is named. The number comes from the database and the topic is
 * the admin's; this is the one place they are put together, so every screen
 * says the same thing.
 */
export function sessionLabel(sessionNumber: number, topic?: string | null): string {
  const name = `Session ${sessionNumber}`;
  const trimmed = topic?.trim();
  return trimmed ? `${name} — ${trimmed}` : name;
}

/** The title to show for any event, session or not. */
export function eventTitle(event: {
  type: EventType;
  title: string;
  session_number?: number | null;
}): string {
  if (event.type === "Session" && event.session_number != null) {
    return sessionLabel(event.session_number, event.title);
  }
  return event.title;
}

export const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
};

/** Late still means they were there. */
export function countsAsPresent(status: AttendanceStatus | null): boolean {
  return status === "present" || status === "late";
}

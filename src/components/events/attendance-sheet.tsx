"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCheck, Clock, Hash, MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { ActionForm, SubmitButton } from "@/components/shared/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate, initialsOf } from "@/lib/utils";
import { countsAsPresent, sessionLabel } from "@/lib/events";
import { renumberSession, saveAttendance } from "@/lib/db/actions";
import type { SessionDetail } from "@/lib/db/queries";
import type { AttendanceStatus } from "@/lib/supabase/types";

type Mark = AttendanceStatus | "unmarked";

const CHOICES: { value: Mark; label: string }[] = [
  { value: "present", label: "Present" },
  { value: "late", label: "Late" },
  { value: "excused", label: "Excused" },
  { value: "absent", label: "Absent" },
];

/**
 * Taking a whole club's attendance in one pass.
 *
 * Marks are held in local state and posted together, so the sheet is one save
 * rather than a write per student. Nobody starts marked: opening the page
 * records nothing, and "Mark all present" is a deliberate click.
 */
export function AttendanceSheet({ session }: { session: SessionDetail }) {
  const saved = React.useMemo<Record<string, Mark>>(
    () => Object.fromEntries(session.roster.map((r) => [r.userId, r.status ?? "unmarked"])),
    [session.roster],
  );
  // Identity of what the server last confirmed, so a save that comes back with
  // different marks replaces the local ones.
  const savedKey = session.roster.map((r) => `${r.userId}:${r.status ?? ""}`).join("|");

  const [marks, setMarks] = React.useState<Record<string, Mark>>(saved);
  const [lastSavedKey, setLastSavedKey] = React.useState(savedKey);

  // Adjusting state during render rather than in an effect: React re-runs this
  // component immediately with the new state and never commits the stale pass,
  // so there is no flash of the previous sheet.
  if (savedKey !== lastSavedKey) {
    setLastSavedKey(savedKey);
    setMarks(saved);
  }

  const set = (userId: string, value: Mark) => setMarks((m) => ({ ...m, [userId]: value }));
  const markAllPresent = () =>
    setMarks(Object.fromEntries(session.roster.map((r) => [r.userId, "present" as Mark])));

  const values = Object.values(marks);
  const present = values.filter((v) => countsAsPresent(v as AttendanceStatus)).length;
  const absent = values.filter((v) => v === "absent").length;
  const unmarked = values.filter((v) => v === "unmarked").length;

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" className="mb-2" render={
          <Link href="/school/events"><ArrowLeft className="size-4" /> All events</Link>
        } />
        <PageHeader
          eyebrow="Session"
          title={sessionLabel(session.sessionNumber, session.topic)}
          description={session.description ?? "Mark who came, then save. You can change it later."}
          actions={<RenumberSession session={session} />}
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {formatDate(session.date)}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {session.startTime.slice(0, 5)}
            {session.endTime ? `–${session.endTime.slice(0, 5)}` : ""}
          </span>
          <span className="flex items-center gap-1"><MapPin className="size-3" /> {session.location}</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Present" value={String(present)} icon={CheckCheck} />
        <StatCard label="Absent" value={String(absent)} icon={Users} />
        <StatCard label="Club members" value={String(session.roster.length)} icon={Users} />
      </div>

      {session.roster.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nobody to mark yet"
          description="Once students are accepted into the club they appear on this sheet."
        />
      ) : (
        <ActionForm action={saveAttendance} className="space-y-4">
          <input type="hidden" name="eventId" value={session.id} />
          {session.roster.map((r) => (
            <input key={r.userId} type="hidden" name={`status:${r.userId}`} value={marks[r.userId] ?? "unmarked"} />
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {unmarked === 0
                ? "Everyone has been marked."
                : `${unmarked} of ${session.roster.length} not marked yet.`}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={markAllPresent}>
              <CheckCheck className="size-4" /> Mark all present
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <div className="divide-y divide-border">
              {session.roster.map((r) => (
                <div key={r.userId} className="flex flex-wrap items-center gap-3 p-3">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/10 text-[0.65rem] font-medium text-primary">
                      {initialsOf(r.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.grade ? `Grade ${r.grade} · ` : ""}{r.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {CHOICES.map((c) => {
                      const active = (marks[r.userId] ?? "unmarked") === c.value;
                      return (
                        <Button
                          key={c.value}
                          type="button"
                          size="sm"
                          variant={active ? "default" : "outline"}
                          onClick={() => set(r.userId, active ? "unmarked" : c.value)}
                          aria-pressed={active}
                        >
                          {c.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <SubmitButton pendingLabel="Saving…">Save attendance</SubmitButton>
          </div>
        </ActionForm>
      )}
    </div>
  );
}

/**
 * Correcting a session's number after the fact, for when a few were created by
 * mistake. Whatever is set here is where the sequence carries on from, so the
 * count can go back as well as forward. The database still refuses a number
 * another session already holds.
 */
function RenumberSession({ session }: { session: SessionDetail }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm"><Hash className="size-4" /> Change number</Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change the session number</DialogTitle>
          <DialogDescription>
            This is Session {session.sessionNumber}. Set it to whatever it should be — the next
            session your club creates will carry on from here.
          </DialogDescription>
        </DialogHeader>
        <ActionForm action={renumberSession} onSuccess={() => setOpen(false)}>
          <input type="hidden" name="eventId" value={session.id} />
          <div className="space-y-2">
            <Label htmlFor="sessionNumber">Session number</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Session</span>
              <Input
                id="sessionNumber"
                name="sessionNumber"
                type="number"
                min={1}
                step={1}
                required
                defaultValue={session.sessionNumber}
                className="w-24"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Another session in your club may already hold the number you pick, in which case this
              is refused rather than creating two of the same.
            </p>
          </div>
          <DialogFooter>
            <SubmitButton pendingLabel="Saving…">Save number</SubmitButton>
          </DialogFooter>
        </ActionForm>
      </DialogContent>
    </Dialog>
  );
}

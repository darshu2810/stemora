"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Plus, Trash2, Clock, ClipboardCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { ActionForm, SubmitButton, ActionButton } from "@/components/shared/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { EVENT_TYPES, eventTitle, keepsAttendance } from "@/lib/events";
import { createEvent, cancelEvent } from "@/lib/db/actions";
import type { StemEvent, EventType } from "@/lib/supabase/types";

const TYPE_LABELS = Object.fromEntries(EVENT_TYPES.map((t) => [t, t]));

export function SchoolEventsView({
  clubName, events, today, canManage, nextSessionNumber,
}: {
  clubName: string;
  events: StemEvent[];
  today: string;
  canManage: boolean;
  /** Advisory: the database assigns the real number on create. */
  nextSessionNumber: number | null;
}) {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<EventType>("Session");
  const isSession = keepsAttendance(type);

  const upcoming = events.filter((e) => e.event_date >= today);
  const past = events.filter((e) => e.event_date < today).reverse();
  const thisMonth = events.filter((e) => e.event_date.startsWith(today.slice(0, 7))).length;
  const sessions = events.filter((e) => e.type === "Session").length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={clubName}
        title="Events"
        description="Club sessions, workshops, competitions and trips on one schedule. Sessions are the ones that take attendance."
        actions={canManage ? (
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setType("Session"); }}>
            <DialogTrigger render={<Button><Plus className="size-4" /> Add Event</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add an event</DialogTitle>
                <DialogDescription>Everyone in the STEM Club is invited to every event.</DialogDescription>
              </DialogHeader>
              <ActionForm action={createEvent} onSuccess={() => setOpen(false)}>
                <div className="space-y-2">
                  <Label htmlFor="type">Event type</Label>
                  <Select
                    items={TYPE_LABELS}
                    name="type"
                    value={type}
                    onValueChange={(v) => setType((v as EventType) ?? "Session")}
                  >
                    <SelectTrigger id="type" className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {isSession ? (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Session number
                    </p>
                    <p className="mt-0.5 font-display text-lg font-semibold">
                      {nextSessionNumber ? `Session ${nextSessionNumber}` : "Session 1"}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Numbered automatically by STEMORA, counting only this club. You can&apos;t edit
                      it — that is what keeps the sequence honest.
                    </p>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="title">{isSession ? "Topic" : "Title"}</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder={isSession ? "Robotics — building line-following robots" : "Regional science fair"}
                  />
                  {isSession && nextSessionNumber ? (
                    <p className="text-xs text-muted-foreground">
                      Shown as “Session {nextSessionNumber} — your topic”.
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" required placeholder="Lab 2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Start time</Label>
                    <Input id="time" name="time" type="time" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End time</Label>
                    <Input id="endTime" name="endTime" type="time" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={2} placeholder="Optional" />
                </div>

                <DialogFooter>
                  <SubmitButton pendingLabel="Adding…">
                    {isSession ? "Create session" : "Add event"}
                  </SubmitButton>
                </DialogFooter>
              </ActionForm>
            </DialogContent>
          </Dialog>
        ) : undefined}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Sessions held" value={String(sessions)} icon={ClipboardCheck} />
        <StatCard label="Upcoming" value={String(upcoming.length)} icon={CalendarDays} />
        <StatCard label="This month" value={String(thisMonth)} icon={Clock} />
        <StatCard label="Held so far" value={String(past.length)} icon={CalendarDays} />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No events have been scheduled yet"
              description={canManage ? "Create the club's first session to get the term started." : "When your School Admin schedules one, it appears here."} />
          ) : (
            <div className="space-y-3">
              {upcoming.map((e) => <EventRow key={e.id} event={e} canManage={canManage} />)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          {past.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No events have been held yet"
              description="Once an event date passes it moves here." />
          ) : (
            <div className="space-y-3">
              {past.map((e) => <EventRow key={e.id} event={e} canManage={canManage} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventRow({ event, canManage }: { event: StemEvent; canManage: boolean }) {
  const isSession = event.type === "Session" && event.session_number != null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={
              isSession
                ? "inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wider text-primary"
                : "inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wider text-secondary-foreground"
            }
          >
            {event.type}
          </span>

          {/* "Session 21 — Robotics": the number from the database, the topic
              from the club head, composed in one place. */}
          <h3 className="mt-1.5 font-display font-semibold">{eventTitle(event)}</h3>

          {event.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {formatDate(event.event_date)}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {event.start_time.slice(0, 5)}
              {event.end_time ? `–${event.end_time.slice(0, 5)}` : ""}
            </span>
            <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.location}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isSession && canManage ? (
            <Button variant="outline" size="sm" render={
              <Link href={`/school/events/${event.id}`}>
                <ClipboardCheck className="size-4" /> Attendance
              </Link>
            } />
          ) : null}
          {canManage ? (
            <ActionButton action={cancelEvent} fields={{ eventId: event.id }} size="icon" ariaLabel={`Cancel ${event.title || "event"}`}>
              <Trash2 className="size-4" />
            </ActionButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

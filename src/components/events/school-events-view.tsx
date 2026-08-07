"use client";

import * as React from "react";
import { CalendarDays, MapPin, Plus, Trash2, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { ActionForm, SubmitButton, ActionButton } from "@/components/shared/action-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { createEvent, cancelEvent } from "@/lib/db/actions";
import type { StemEvent, EventType } from "@/lib/supabase/types";

const EVENT_TYPES: EventType[] = ["Meeting", "Workshop", "Competition", "Showcase"];
const TYPE_LABELS = Object.fromEntries(EVENT_TYPES.map((t) => [t, t]));

export function SchoolEventsView({
  clubName, events, today, canManage,
}: { clubName: string; events: StemEvent[]; today: string; canManage: boolean }) {
  const [open, setOpen] = React.useState(false);

  const upcoming = events.filter((e) => e.event_date >= today);
  const past = events.filter((e) => e.event_date < today).reverse();
  const thisMonth = events.filter((e) => e.event_date.startsWith(today.slice(0, 7))).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={clubName}
        title="Events"
        description="Meetings, workshops, showcases, and competition days on one schedule."
        actions={canManage ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button><Plus className="size-4" /> Add Event</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add an event</DialogTitle>
                <DialogDescription>Everyone in the STEM Club is invited to every event.</DialogDescription>
              </DialogHeader>
              <ActionForm action={createEvent} onSuccess={() => setOpen(false)}>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required placeholder="Weekly STEM Club Meeting" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select items={TYPE_LABELS} name="type" defaultValue="Meeting">
                    <SelectTrigger id="type" className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" type="time" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" required placeholder="Science Block, Lab 2" />
                </div>
                <DialogFooter><SubmitButton pendingLabel="Adding…">Add Event</SubmitButton></DialogFooter>
              </ActionForm>
            </DialogContent>
          </Dialog>
        ) : undefined}
      />

      <div className="grid gap-4 sm:grid-cols-3">
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
              description={canManage ? "Add the weekly meeting to get the term started." : "When your School Admin schedules one, it appears here."} />
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
              {past.map((e) => <EventRow key={e.id} event={e} canManage={false} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventRow({ event, canManage }: { event: StemEvent; canManage: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{event.type}</p>
          <h3 className="mt-1 font-display font-semibold">{event.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {formatDate(event.event_date)}</span>
            <span className="flex items-center gap-1"><Clock className="size-3" /> {event.start_time.slice(0, 5)}</span>
            <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.location}</span>
          </div>
        </div>
        {canManage ? (
          <ActionButton action={cancelEvent} fields={{ eventId: event.id }} size="icon" ariaLabel={`Cancel ${event.title}`}>
            <Trash2 className="size-4" />
          </ActionButton>
        ) : null}
      </div>
    </div>
  );
}

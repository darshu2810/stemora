"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarDays, MapPin, Users2, Plus, Trash2, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { ClubFilter } from "@/components/shared/club-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { mockEvents as initialEvents, mockClubs, type SchoolEvent } from "@/lib/mock-data";

// The pilot fixture data is anchored to this term; a real build reads the clock.
const TODAY = "2026-08-02";

const eventSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  clubId: z.string().optional(),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  location: z.string().min(2, "Enter a location"),
});
type EventValues = z.infer<typeof eventSchema>;

export function SchoolEventsView({ eyebrow }: { eyebrow: string }) {
  const [events, setEvents] = React.useState<SchoolEvent[]>(initialEvents);
  const [clubFilter, setClubFilter] = React.useState("all");
  const [open, setOpen] = React.useState(false);

  const form = useForm<EventValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { title: "", date: "", time: "", location: "" },
  });

  function onCreate(values: EventValues) {
    const club = mockClubs.find((c) => c.id === values.clubId);
    setEvents((prev) => [
      ...prev,
      {
        id: `ev_new_${prev.length}_${values.title.length}`,
        title: values.title,
        club: club?.name ?? null,
        date: values.date,
        time: values.time,
        location: values.location,
        going: 0,
        invited: club ? club.members : 727,
      },
    ]);
    toast.success(`${values.title} added to the schedule`);
    form.reset();
    setOpen(false);
  }

  function onCancelEvent(event: SchoolEvent) {
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
    toast.success(`${event.title} cancelled`);
  }

  const filterClubName = mockClubs.find((c) => c.id === clubFilter)?.name;
  const filtered = events.filter((e) => clubFilter === "all" || e.club === filterClubName);
  const upcoming = filtered.filter((e) => e.date >= TODAY).sort((a, b) => (a.date < b.date ? -1 : 1));
  const past = filtered.filter((e) => e.date < TODAY).sort((a, b) => (a.date < b.date ? 1 : -1));

  const thisMonth = events.filter((e) => e.date.startsWith(TODAY.slice(0, 7))).length;
  const totalRsvps = events.reduce((sum, e) => sum + e.going, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={eyebrow}
        title="Events"
        description="Club meetings, competitions, and school-wide events on one schedule."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button><Plus className="size-4" /> Create event</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create an event</DialogTitle>
                <DialogDescription>Leave the club blank for a school-wide event.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Regional Robotics Qualifier" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clubId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Club (optional)</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="School-wide" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockClubs.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Lab 3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>Create event</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming" value={String(events.filter((e) => e.date >= TODAY).length)} icon={CalendarDays} />
        <StatCard label="This month" value={String(thisMonth)} icon={Clock} />
        <StatCard label="Total RSVPs" value={String(totalRsvps)} icon={Users2} />
      </div>

      <ClubFilter value={clubFilter} onChange={setClubFilter} className="w-56" />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Nothing scheduled"
              description="Create an event to get the term started."
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((e) => (
                <EventRow key={e.id} event={e} onCancel={onCancelEvent} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {past.length === 0 ? (
            <EmptyState icon={CalendarDays} title="No past events" description="Wrapped-up events land here." />
          ) : (
            <div className="space-y-3">
              {past.map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventRow({ event, onCancel }: { event: SchoolEvent; onCancel?: (event: SchoolEvent) => void }) {
  const attendance = event.invited > 0 ? (event.going / event.invited) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            {event.club ?? "School-wide"}
          </p>
          <h3 className="mt-1 font-display font-semibold">{event.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {event.date}</span>
            <span className="flex items-center gap-1"><Clock className="size-3" /> {event.time}</span>
            <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.location}</span>
          </div>
        </div>
        {onCancel ? (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="ghost" size="icon" aria-label={`Cancel ${event.title}`}>
                  <Trash2 className="size-4" />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel {event.title}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Everyone invited will be notified. This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep event</AlertDialogCancel>
                <AlertDialogAction onClick={() => onCancel(event)}>Cancel event</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users2 className="size-3" /> {event.going} going</span>
          <span>{event.invited} invited</span>
        </div>
        <Progress value={attendance} className="mt-1.5 h-1.5" />
      </div>
    </div>
  );
}

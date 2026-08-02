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
import { formatDate } from "@/lib/utils";
import {
  mockEvents as initialEvents,
  mockSchool,
  clubStats,
  DEMO_TODAY,
  EVENT_TYPES,
  type EventType,
  type StemEvent,
} from "@/lib/mock-data";

const eventSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  type: z.custom<EventType>(),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  location: z.string().min(2, "Enter a location"),
});
type EventValues = z.infer<typeof eventSchema>;

/** Every event belongs to the STEM Club — there is nothing else to scope to. */
export function SchoolEventsView({ canManage }: { canManage: boolean }) {
  const [events, setEvents] = React.useState<StemEvent[]>(initialEvents);
  const [open, setOpen] = React.useState(false);

  const form = useForm<EventValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { title: "", type: "Meeting", date: "", time: "", location: "" },
  });

  function onCreate(values: EventValues) {
    setEvents((prev) => [
      ...prev,
      {
        id: `ev_new_${prev.length}_${values.title.length}`,
        title: values.title,
        type: values.type,
        date: values.date,
        time: values.time,
        location: values.location,
        going: 0,
      },
    ]);
    toast.success(`${values.title} added to the schedule`);
    form.reset();
    setOpen(false);
  }

  function onCancelEvent(event: StemEvent) {
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
    toast.success(`${event.title} cancelled`);
  }

  const upcoming = events.filter((e) => e.date >= DEMO_TODAY).sort((a, b) => (a.date < b.date ? -1 : 1));
  const past = events.filter((e) => e.date < DEMO_TODAY).sort((a, b) => (a.date < b.date ? 1 : -1));
  const thisMonth = events.filter((e) => e.date.startsWith(DEMO_TODAY.slice(0, 7))).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
        title="Events"
        description="Meetings, workshops, showcases, and competition days on one schedule."
        actions={
          canManage ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button><Plus className="size-4" /> Add Event</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add an event</DialogTitle>
                  <DialogDescription>Everyone in the STEM Club is invited to every event.</DialogDescription>
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
                            <Input placeholder="Weekly STEM Club Meeting" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EVENT_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
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
                            <Input placeholder="Science Block, Lab 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={form.formState.isSubmitting}>Add Event</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming" value={String(upcoming.length)} icon={CalendarDays} />
        <StatCard label="This month" value={String(thisMonth)} icon={Clock} />
        <StatCard label="Held this term" value={String(past.length)} icon={Users2} />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No events have been scheduled yet"
              description="Add the weekly meeting to get the term started."
            />
          ) : (
            <div className="space-y-3">
              {upcoming.map((e) => (
                <EventRow key={e.id} event={e} onCancel={canManage ? onCancelEvent : undefined} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {past.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No events have been held yet"
              description="Once an event date passes it moves here with its final attendance."
            />
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

function EventRow({ event, onCancel }: { event: StemEvent; onCancel?: (event: StemEvent) => void }) {
  // Every active student is invited to every club event, so attendance is
  // simply how many of them said they're coming.
  const invited = clubStats.activeStudents;
  const attendance = (event.going / invited) * 100;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            {event.type}
          </p>
          <h3 className="mt-1 font-display font-semibold">{event.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays className="size-3" /> {formatDate(event.date)}</span>
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
                  Everyone in the STEM Club will be notified. This can&apos;t be undone.
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
          <span>{invited} students in the club</span>
        </div>
        <Progress value={attendance} className="mt-1.5 h-1.5" />
      </div>
    </div>
  );
}

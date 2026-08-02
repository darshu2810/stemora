"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, MapPin, Users2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarMonth } from "@/components/shared/calendar-month";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { mockEvents as initialEvents, mockClubs, type SchoolEvent } from "@/lib/mock-data";

const eventSchema = z.object({
  title: z.string().min(2, "Enter a title"),
  clubId: z.string().optional(),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  location: z.string().min(2, "Enter a location"),
});
type EventValues = z.infer<typeof eventSchema>;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function SchoolCalendarView({ eyebrow, canManage }: { eyebrow: string; canManage: boolean }) {
  const [events, setEvents] = React.useState<SchoolEvent[]>(initialEvents);
  const [year, setYear] = React.useState(2026);
  const [month, setMonth] = React.useState(7); // August
  const [selectedDate, setSelectedDate] = React.useState<string | undefined>(undefined);
  const [open, setOpen] = React.useState(false);

  const form = useForm<EventValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { title: "", date: "", time: "", location: "" },
  });

  function changeMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
  }

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
    toast.success(`${values.title} added to the calendar`);
    form.reset();
    setOpen(false);
  }

  const upcoming = [...events]
    .filter((e) => `${e.date}` >= `${year}-${String(month + 1).padStart(2, "0")}-01`)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const dayEvents = selectedDate ? events.filter((e) => e.date === selectedDate) : [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={eyebrow}
        title="Calendar"
        description="Every club meeting and school-wide event."
        actions={
          canManage ? (
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
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display font-semibold">{MONTH_NAMES[month]} {year}</h2>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => changeMonth(-1)} aria-label="Previous month">
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => changeMonth(1)} aria-label="Next month">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
          <CalendarMonth year={year} month={month} events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

          {selectedDate ? (
            <div className="mt-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{selectedDate}</h3>
              {dayEvents.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No events this day.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {dayEvents.map((e) => (
                    <EventRow key={e.id} event={e} />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div>
          <h2 className="font-display font-semibold">Upcoming</h2>
          {upcoming.length === 0 ? (
            <EmptyState icon={MapPin} title="Nothing scheduled" description="Create an event to get started." className="mt-3" />
          ) : (
            <div className="mt-3 space-y-2">
              {upcoming.slice(0, 8).map((e) => (
                <EventRow key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventRow({ event }: { event: SchoolEvent }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-sm font-medium">{event.title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{event.club ?? "School-wide"} · {event.date} · {event.time}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="size-3" /> {event.location}</span>
        <span className="flex items-center gap-1"><Users2 className="size-3" /> {event.going}/{event.invited} going</span>
      </div>
    </div>
  );
}

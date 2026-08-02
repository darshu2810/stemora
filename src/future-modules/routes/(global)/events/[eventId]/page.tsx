import { notFound } from "next/navigation";
import { MapPin, Building2, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { FollowButton } from "@/components/community/follow-button";
import { mockGlobalEvents } from "@/lib/mock-global";

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = mockGlobalEvents.find((e) => e.id === eventId);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge variant="secondary">{event.type}</Badge>
            <h1 className="mt-2 font-display text-2xl font-semibold">{event.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {event.location} · {event.date}
            </p>
          </div>
          <FollowButton id={`event:${event.id}`} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Organizer" value={event.organizer} icon={Building2} />
        <StatCard label="Format" value={event.type} icon={CalendarDays} />
        <StatCard label="Registration" value={event.registrationOpen ? "Open" : "Closed"} />
      </div>

      <section className="rounded-xl border border-dashed border-border bg-secondary/40 p-5">
        <h2 className="font-display font-semibold">Registration</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {event.registrationOpen
            ? "Registration is open — sign-ups go through the organizer."
            : "Registration for this event has closed."}
        </p>
      </section>
    </div>
  );
}

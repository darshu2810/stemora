import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GlobalEvent } from "@/lib/mock-global";

export function EventCard({ event }: { event: GlobalEvent }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary">{event.type}</Badge>
        {event.registrationOpen ? (
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-primary">Registration open</span>
        ) : (
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">Closed</span>
        )}
      </div>
      <h3 className="mt-2 font-display text-sm font-semibold">{event.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{event.description}</p>
      <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3" /> {event.location} · {event.date}
      </p>
    </Link>
  );
}

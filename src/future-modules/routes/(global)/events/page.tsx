"use client";

import * as React from "react";
import { CalendarDays, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/global/event-card";
import { mockGlobalEvents, type GlobalEventType } from "@/lib/mock-global";

export default function EventsDirectoryPage() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<GlobalEventType | "all">("all");

  const filtered = mockGlobalEvents
    .filter(
      (e) =>
        (type === "all" || e.type === type) &&
        (e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.location.toLowerCase().includes(query.toLowerCase()) ||
          e.organizer.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA Network"
        title="Events"
        description="Workshops, hackathons, conferences, and seminars across the network."
      />

      <Tabs value={type} onValueChange={(v) => v && setType(v as GlobalEventType | "all")}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Workshop">Workshops</TabsTrigger>
          <TabsTrigger value="Hackathon">Hackathons</TabsTrigger>
          <TabsTrigger value="Conference">Conferences</TabsTrigger>
          <TabsTrigger value="Seminar">Seminars</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events…" className="pl-8" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No events match your filters" description="Try a different search term or type." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  );
}

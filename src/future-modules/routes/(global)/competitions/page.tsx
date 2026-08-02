"use client";

import * as React from "react";
import { Trophy, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompetitionCard } from "@/components/global/competition-card";
import { mockGlobalCompetitions, type CompetitionRegistration } from "@/lib/mock-global";

export default function GlobalCompetitionsPage() {
  const [query, setQuery] = React.useState("");
  const [registration, setRegistration] = React.useState<CompetitionRegistration | "all">("all");
  const [category, setCategory] = React.useState("all");

  const categories = Array.from(new Set(mockGlobalCompetitions.map((c) => c.category))).sort();

  const filtered = mockGlobalCompetitions
    .filter(
      (c) =>
        (registration === "all" || c.registration === registration) &&
        (category === "all" || c.category === category) &&
        (c.name.toLowerCase().includes(query.toLowerCase()) || c.organizer.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA Network"
        title="Competitions"
        description="Every competition open to students on the network."
      />

      <Tabs value={registration} onValueChange={(v) => v && setRegistration(v as CompetitionRegistration | "all")}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Registration open</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search competitions…" className="pl-8" />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Trophy} title="No competitions match your filters" description="Try a different search term or filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((c) => <CompetitionCard key={c.id} competition={c} />)}
        </div>
      )}
    </div>
  );
}

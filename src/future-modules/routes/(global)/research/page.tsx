"use client";

import * as React from "react";
import { FlaskConical, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResearchCard } from "@/components/global/research-card";
import { mockResearchItems, type ResearchType } from "@/lib/mock-global";

export default function ResearchHubPage() {
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState<ResearchType | "all">("all");
  const [category, setCategory] = React.useState("all");

  const categories = Array.from(new Set(mockResearchItems.map((r) => r.category))).sort();

  const filtered = mockResearchItems
    .filter(
      (r) =>
        (type === "all" || r.type === type) &&
        (category === "all" || r.category === category) &&
        (r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.abstract.toLowerCase().includes(query.toLowerCase()) ||
          r.authors.some((a) => a.toLowerCase().includes(query.toLowerCase())))
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA Network"
        title="Research hub"
        description="Papers, posters, and case studies published by students worldwide."
      />

      <Tabs value={type} onValueChange={(v) => v && setType(v as ResearchType | "all")}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Paper">Papers</TabsTrigger>
          <TabsTrigger value="Poster">Posters</TabsTrigger>
          <TabsTrigger value="Case Study">Case studies</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search research…" className="pl-8" />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Field" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fields</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FlaskConical} title="No research matches your filters" description="Try a different search term or filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((r) => <ResearchCard key={r.id} item={r} />)}
        </div>
      )}
    </div>
  );
}

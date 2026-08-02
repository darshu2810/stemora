"use client";

import * as React from "react";
import { FolderKanban, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectCard } from "@/components/global/project-card";
import { mockShowcaseProjects } from "@/lib/mock-global";

export default function ProjectShowcasePage() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [country, setCountry] = React.useState("all");
  const [sort, setSort] = React.useState("trending");

  const categories = Array.from(new Set(mockShowcaseProjects.map((p) => p.category))).sort();
  const countries = Array.from(new Set(mockShowcaseProjects.map((p) => p.country))).sort();

  const filtered = mockShowcaseProjects
    .filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (country === "all" || p.country === country) &&
        (p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.school.toLowerCase().includes(query.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(query.toLowerCase())))
    )
    .sort((a, b) => (sort === "trending" ? b.likes - a.likes : b.downloads - a.downloads));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA Network"
        title="Project showcase"
        description="Student builds from every school on the network."
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects or tech…" className="pl-8" />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={country} onValueChange={(v) => setCountry(v ?? "all")}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v ?? "trending")}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">Most liked</SelectItem>
            <SelectItem value="downloads">Most downloaded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects match your filters" description="Try a different search term or filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}

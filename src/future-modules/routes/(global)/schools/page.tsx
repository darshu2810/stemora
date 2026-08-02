"use client";

import * as React from "react";
import { Building2, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SchoolCard } from "@/components/global/school-card";
import { mockGlobalSchools } from "@/lib/mock-global";

export default function SchoolsDirectoryPage() {
  const [query, setQuery] = React.useState("");
  const [country, setCountry] = React.useState("all");
  const [curriculum, setCurriculum] = React.useState("all");
  const [category, setCategory] = React.useState("all");

  const countries = Array.from(new Set(mockGlobalSchools.map((s) => s.country))).sort();
  const curricula = Array.from(new Set(mockGlobalSchools.map((s) => s.curriculum))).sort();
  const categories = Array.from(new Set(mockGlobalSchools.flatMap((s) => s.categories))).sort();

  const filtered = mockGlobalSchools.filter(
    (s) =>
      (country === "all" || s.country === country) &&
      (curriculum === "all" || s.curriculum === curriculum) &&
      (category === "all" || s.categories.includes(category)) &&
      (s.name.toLowerCase().includes(query.toLowerCase()) || s.city.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA Network"
        title="School directory"
        description={`${mockGlobalSchools.length} schools across ${countries.length} countries.`}
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search schools or cities…" className="pl-8" />
        </div>
        <Select value={country} onValueChange={(v) => setCountry(v ?? "all")}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={curriculum} onValueChange={(v) => setCurriculum(v ?? "all")}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Curriculum" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All curricula</SelectItem>
            {curricula.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
          <SelectTrigger className="w-44"><SelectValue placeholder="STEM category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No schools match your filters" description="Try a different search term or filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((s) => <SchoolCard key={s.id} school={s} />)}
        </div>
      )}
    </div>
  );
}

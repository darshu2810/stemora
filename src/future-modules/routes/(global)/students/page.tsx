"use client";

import * as React from "react";
import { Users2, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentCard } from "@/components/global/student-card";
import { mockGlobalStudents } from "@/lib/mock-global";

export default function StudentDirectoryPage() {
  const [query, setQuery] = React.useState("");
  const [school, setSchool] = React.useState("all");
  const [skill, setSkill] = React.useState("all");
  const [interest, setInterest] = React.useState("all");

  const schools = Array.from(new Set(mockGlobalStudents.map((s) => s.school))).sort();
  const skills = Array.from(new Set(mockGlobalStudents.flatMap((s) => s.skills))).sort();
  const interests = Array.from(new Set(mockGlobalStudents.flatMap((s) => s.interests))).sort();

  const filtered = mockGlobalStudents.filter(
    (s) =>
      (school === "all" || s.school === school) &&
      (skill === "all" || s.skills.includes(skill)) &&
      (interest === "all" || s.interests.includes(interest)) &&
      (s.name.toLowerCase().includes(query.toLowerCase()) || s.headline.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="STEMORA Network"
        title="Student directory"
        description={`${mockGlobalStudents.length} students building across the network.`}
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students…" className="pl-8" />
        </div>
        <Select value={school} onValueChange={(v) => setSchool(v ?? "all")}>
          <SelectTrigger className="w-56"><SelectValue placeholder="School" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All schools</SelectItem>
            {schools.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={skill} onValueChange={(v) => setSkill(v ?? "all")}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Skill" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All skills</SelectItem>
            {skills.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={interest} onValueChange={(v) => setInterest(v ?? "all")}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Interest" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All interests</SelectItem>
            {interests.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users2} title="No students match your filters" description="Try a different search term or filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((s) => <StudentCard key={s.id} student={s} />)}
        </div>
      )}
    </div>
  );
}

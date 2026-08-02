import { notFound } from "next/navigation";
import { MapPin, Users2, Building2, Layers } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge, type StatusKind } from "@/components/shared/status-badge";
import { FollowButton } from "@/components/community/follow-button";
import { mockGlobalCompetitions, type CompetitionRegistration } from "@/lib/mock-global";

const REG_MAP: Record<CompetitionRegistration, StatusKind> = {
  open: "active",
  closed: "closed",
  upcoming: "pending",
};

export default async function CompetitionDetailPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params;
  const competition = mockGlobalCompetitions.find((c) => c.id === competitionId);
  if (!competition) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              {competition.category} · {competition.level}
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold">{competition.name}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {competition.country} · {competition.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={REG_MAP[competition.registration]} label={competition.registration} />
            <FollowButton id={`competition:${competition.id}`} />
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{competition.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Organizer" value={competition.organizer} icon={Building2} />
        <StatCard label="Level" value={competition.level} icon={Layers} />
        <StatCard
          label="Participants"
          value={competition.participants > 0 ? competition.participants.toLocaleString() : "TBA"}
          icon={Users2}
        />
      </div>

      <section className="rounded-xl border border-dashed border-border bg-secondary/40 p-5">
        <h2 className="font-display font-semibold">Registration</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {competition.registration === "open"
            ? "Registration is open — coordinate with your club leader to enter a team."
            : competition.registration === "upcoming"
              ? "Registration hasn't opened yet. Follow this competition to be notified."
              : "Registration for this edition has closed."}
        </p>
      </section>
    </div>
  );
}

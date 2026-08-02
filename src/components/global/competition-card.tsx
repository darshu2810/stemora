import Link from "next/link";
import { MapPin } from "lucide-react";
import { StatusBadge, type StatusKind } from "@/components/shared/status-badge";
import type { GlobalCompetition, CompetitionRegistration } from "@/lib/mock-global";

const REG_MAP: Record<CompetitionRegistration, StatusKind> = {
  open: "active",
  closed: "closed",
  upcoming: "pending",
};

export function CompetitionCard({ competition }: { competition: GlobalCompetition }) {
  return (
    <Link
      href={`/competitions/${competition.id}`}
      className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">{competition.category} · {competition.level}</p>
          <h3 className="mt-1 font-display text-sm font-semibold">{competition.name}</h3>
        </div>
        <StatusBadge status={REG_MAP[competition.registration]} label={competition.registration} />
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{competition.description}</p>
      <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="size-3" /> {competition.country} · {competition.date}
      </p>
    </Link>
  );
}

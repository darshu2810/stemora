import { Award, Trophy } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { mockUsers, mockLeaderboard } from "@/lib/mock-data";

const RANK_STYLES = [
  "bg-amber-400/20 text-amber-600 dark:text-amber-400",
  "bg-zinc-400/20 text-zinc-500 dark:text-zinc-300",
  "bg-orange-400/20 text-orange-600 dark:text-orange-400",
];

export default function LeaderboardPage() {
  const student = mockUsers.student;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={student.club}
        title="Leaderboard"
        description="Points earned from badges, club leadership, and competition results."
      />

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {mockLeaderboard.map((entry, i) => {
          const rank = i + 1;
          const isMe = entry.memberId === student.id;
          return (
            <div
              key={entry.memberId}
              className={cn("flex items-center justify-between gap-4 p-4", isMe && "bg-primary/5")}
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold",
                    rank <= 3 ? RANK_STYLES[rank - 1] : "bg-muted text-muted-foreground"
                  )}
                >
                  {rank}
                </span>
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">{entry.avatarInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {entry.name} {isMe ? <span className="text-xs text-primary">(you)</span> : null}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.club ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Award className="size-3.5" /> {entry.badgeCount}
                </span>
                <span className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums">
                  <Trophy className="size-3.5 text-primary" /> {entry.points}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

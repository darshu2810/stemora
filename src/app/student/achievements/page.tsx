import {
  Lightbulb,
  Users2,
  FlaskConical,
  Code2,
  Cog,
  Trophy,
  HeartHandshake,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { cn, formatDate } from "@/lib/utils";
import { mockSchool, mockUsers, mockAchievements, BADGE_DEFS, type BadgeId } from "@/lib/mock-data";

const BADGE_ICONS: Record<BadgeId, LucideIcon> = {
  innovation: Lightbulb,
  leadership: Users2,
  science_fair: FlaskConical,
  programmer: Code2,
  engineering: Cog,
  robotics_finalist: Trophy,
  peer_coach: HeartHandshake,
};

export default function AchievementsPage() {
  const student = mockUsers.student;
  const earned = mockAchievements[student.id] ?? [];
  const earnedMap = new Map(earned.map((a) => [a.badgeId, a]));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={mockSchool.clubName}
        title="Achievements"
        description={`${earned.length} of ${BADGE_DEFS.length} club awards earned.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BADGE_DEFS.map((badge) => {
          const Icon = BADGE_ICONS[badge.id];
          const record = earnedMap.get(badge.id);
          const isEarned = !!record;
          return (
            <div
              key={badge.id}
              className={cn(
                "rounded-xl border p-5 transition-colors",
                isEarned ? "border-primary/30 bg-card" : "border-dashed border-border bg-secondary/30"
              )}
            >
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-full",
                  isEarned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {isEarned ? <Icon className="size-5" strokeWidth={1.75} /> : <Lock className="size-4" strokeWidth={1.75} />}
              </div>
              <h3 className="mt-3 font-display font-semibold">{badge.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
              {isEarned ? (
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-primary">
                  Earned {formatDate(record.earnedAt)}
                </p>
              ) : (
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  Not earned yet
                </p>
              )}
              {record?.note ? <p className="mt-1 text-xs text-muted-foreground">{record.note}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

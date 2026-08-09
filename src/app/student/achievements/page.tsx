import {
  Award,
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
import { requireStudent } from "@/lib/auth/session";
import { achievementsWithBadges, listBadges } from "@/lib/db/queries";

// Keyed on the badge's name as stored in the `badges` table. A badge added by
// a future migration falls back to a generic award icon rather than crashing.
const BADGE_ICONS: Record<string, LucideIcon> = {
  "Innovation Award": Lightbulb,
  "STEM Leadership Award": Users2,
  "Science Fair Winner": FlaskConical,
  "Outstanding Programmer": Code2,
  "Best Engineering Design": Cog,
  "Robotics Competition Finalist": Trophy,
  "Peer Coach": HeartHandshake,
};

export default async function AchievementsPage() {
  const session = await requireStudent();
  const [badges, earned] = await Promise.all([
    listBadges(),
    achievementsWithBadges(session.schoolId, session.userId),
  ]);

  const earnedMap = new Map(earned.map((a) => [a.badge_id, a]));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={session.clubName ?? "STEM Club"}
        title="Achievements"
        description={`${earned.length} of ${badges.length} club awards earned.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => {
          const Icon = BADGE_ICONS[badge.name] ?? Award;
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
                {isEarned ? (
                  <Icon className="size-5" strokeWidth={1.75} />
                ) : (
                  <Lock className="size-4" strokeWidth={1.75} />
                )}
              </div>
              <h3 className="mt-3 font-display font-semibold">{badge.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>
              {record ? (
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-primary">
                  Earned {formatDate(record.earned_at)}
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

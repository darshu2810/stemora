import { type LucideIcon, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  delta?: { value: string; direction: "up" | "down" };
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {Icon ? <Icon className="size-4 text-muted-foreground" strokeWidth={1.75} /> : null}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-2xl font-semibold tabular-nums">{value}</span>
        {delta ? (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              delta.direction === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
            )}
          >
            {delta.direction === "up" ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {delta.value}
          </span>
        ) : null}
      </div>
    </div>
  );
}
